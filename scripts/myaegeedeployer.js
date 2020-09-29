// Description:
//   deploy script
//
// Dependencies:
//   node-ssh, hubot-auth
//
// Configuration:
//   None
//
// Commands:
//   hubot deploy (frontend|core|events|statutory|discounts|mailer) to <environment> - deploys <service> to <environment>
//
// Author:
//   https://github.com/serge1peshcoff

const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

const { alwaysThread } = require('../utils/helpers');

const allowedServices = ['frontend', 'core', 'events', 'statutory', 'discounts', 'mailer'];

module.exports = (robot) => {
    robot.hear(/deploy (.*) to (.*)/i, async (msg) => {
        alwaysThread(msg);

        const service = msg.match[1];
        const environment = msg.match[2];

        const user = robot.brain.userForName(msg.message.user.name);
        if (!user) {
            return msg.reply(`User ${msg.message.user.name} does not exist.`);
        }

        if (!robot.auth.hasRole(user, 'deployer')) {
            return msg.reply(`User ${msg.message.user.name} does not have "deployer" role.`);
        }

        if (environment !== 'production') {
            return msg.reply(`Unknown environment: "${environment}". Allowed environments: "production".`);
        }

        if (!allowedServices.includes(service)) {
            return msg.reply(`Unknown service: "${service}". Allowed services: "${allowedServices.join('", "')}".`);
        }

        const ssh = new NodeSSH();

        try {
            const privateKey = fs.readFileSync(path.resolve(__dirname, '../ssh.key'), 'utf-8');
            await ssh.connect({
                host: process.env.PRODUCTION_HOST,
                port: process.env.PRODUCTION_PORT,
                username: process.env.PRODUCTION_USER,
                privateKey
            });
        } catch (err) {
            robot.logger.error(err);
            return msg.reply(`Could not establish SSH connection: ${err}`);
        }

        msg.reply(`The deploy of the Docker image for \`${service}\` is started.`);

        try {
            const result = await ssh.execCommand(`./helper.sh --pull ${service}`, { cwd: process.env.PRODUCTION_PATH });
            console.log('STDOUT: ' + result.stdout);
            console.log('STDERR: ' + result.stderr);
        } catch (err) {
            robot.logger.error(err);
            return msg.reply(`Could not download Docker image for \`${service}\`: ${err}`);
        }

        msg.reply(`Docker image for \`${service}\` is pulled successfully.`);

        try {
            const result = await ssh.execCommand(`./helper.sh --start ${service}`, { cwd: process.env.PRODUCTION_PATH });
            console.log('STDOUT: ' + result.stdout);
            console.log('STDERR: ' + result.stderr);
        } catch (err) {
            robot.logger.error(err);
            return msg.reply(`Could not start service \`${service}\`: ${err}`);
        }

        msg.reply(`The Docker image for \`${service}\` is deployed to ${environment}.`);
    });
};
