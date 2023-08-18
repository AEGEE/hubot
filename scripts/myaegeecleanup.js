// Description:
//   clean up script
//
// Dependencies:
//   node-ssh, hubot-auth
//
// Configuration:
//   None
//
// Commands:
//   hubot clean up <environment> - cleans up <environment>
//
// Author:
//   https://github.com/WikiRik

const path = require('path');
const fs = require('fs');
const { NodeSSH } = require('node-ssh');

const { alwaysThread } = require('../utils/helpers');

module.exports = (robot) => {
    robot.hear(/clean up (.*)/i, async (msg) => {
        alwaysThread(msg);

        const environment = msg.match[1];

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

        msg.reply('The clean up has started.');

        try {
            const result = await ssh.execCommand('docker system prune -f');
            console.log('STDOUT: ' + result.stdout);
            console.log('STDERR: ' + result.stderr);
        } catch (err) {
            robot.logger.error(err);
            return msg.reply(`Clean up failed: ${err}`);
        }

        msg.reply('Clean up was successfull.');
    });
};
