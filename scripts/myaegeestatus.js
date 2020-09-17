// Description:
//   Query services status - simple reading of my.aegee.eu/status
//
//   Examples:
//   - `hubot what status is frontend` - Get status of frontend
//   - `hubot what version is frontend` - Get version of frontend
//   - `hubot what status is core` - Get status of core
//   - `hubot what version is core` - Get version of core
//   - `hubot what status is events` - Get status of events
//   - `hubot what version is events` - Get version of events
//   - `hubot what status is statutory` - Get status of statutory
//   - `hubot what version is statutory` - Get version of statutory
//   - `hubot what status is discounts` - Get status of discounts
//   - `hubot what version is discounts` - Get version of discounts
//   - `hubot what status is mailer` - Get status of mailer
//   - `hubot what version is mailer` - Get version of mailer
//
// Commands:
//   hubot what status is (frontend|core|events|statutory|discounts|mailer)
//   hubot what version is (frontend|core|events|statutory|discounts|mailer)
//
// Author:
//   https://github.com/linuxbandit

module.exports = (robot) => {
  robot.hear(/what status is (frontend|core|events|statutory|discounts|mailer)/i, (res) => {
      
      const service = res.match[1]
      const base_url = "https://my.aegee.eu"
      const path = (service === "frontend" ? "/healthcheck" : `/api/${service}/healthcheck`)

      robot.http(base_url + path)
        .header('Accept', 'application/json')
        .get() ( (err, response, body) => {

        // err & response status checking code here
        if (err != null || response.headers['content-type'].indexOf('application/json') === -1) {
          robot.logger.error(err)
          return res.send("An error occurred, or the answer was not JSON :(")
        }

        try {
          const data = JSON.parse(body)
          let health = data.success ? 'HEALTHY :ok:' : ':warning: UNHEALTHY :warning:'
          return res.send(`Service ${service} is ${health}`)
        } catch (error) {
            robot.logger.error(error)
            return res.send("Ran into an error parsing JSON :(")
        }
      })
  })

  robot.hear(/what version is (frontend|core|events|statutory|discounts|mailer)/i, (res) => {
      
    const service = res.match[1]
    const base_url = "https://my.aegee.eu"
    const path = (service === "frontend" ? "/healthcheck" : `/api/${service}/healthcheck`)

    robot.http(base_url + path)
      .header('Accept', 'application/json')
      .get() ( (err, response, body) => {

      // err & response status checking code here
      if (err != null || response.headers['content-type'].indexOf('application/json') === -1) {
        robot.logger.error(err)
        return res.send("An error occurred, or the answer was not JSON :(")
      }

      try {
        const data = JSON.parse(body)
        let message = "Something went wrong!"
        if (data.success) {
          message = `Service ${service} has version ${data.data.version} deployed`
        }
        return res.send(message)
      } catch (error) {
          robot.logger.error(error)
          return res.send("Ran into an error parsing JSON :(")
      }
    })
  })
  
}
