// Description:
//   holiday detector script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot is it weekend ?  - returns whether is it weekend or not
//   hubot is it holiday ?  - returns whether is it holiday or not
//
// Author:
//   https://stackoverflow.com/a/25169120/1892660

module.exports = function (robot) {
    robot.respond(/is it (weekend|holiday)\s?\?/i, (msg) => {
        const today = new Date();

        msg.reply(today.getDay() === 0 || today.getDay() === 6 ? 'YES' : 'NO');
    });
};
