// Description:
//   Query services status - simple reading of my.aegee.eu/status
//   It also provides the version deployed and the latest released version from github
//
//   Examples:
//   - `hubot what status is frontend` - Get status of frontend
//   - `hubot what version is frontend` - Get version of frontend
//   - `hubot which is last frontend` - Get latest released version of frontend
//   - `hubot what status is core` - Get status of core
//   - `hubot what version is core` - Get version of core
//   - `hubot which is last core` - Get latest released version of core
//   - `hubot what status is events` - Get status of events
//   - `hubot what version is events` - Get version of events
//   - `hubot which is last events` - Get latest released version of events
//   - `hubot what status is statutory` - Get status of statutory
//   - `hubot what version is statutory` - Get version of statutory
//   - `hubot which is last statutory` - Get latest released version of statutory
//   - `hubot what status is discounts` - Get status of discounts
//   - `hubot what version is discounts` - Get version of discounts
//   - `hubot which is last discounts` - Get latest released version of discounts
//   - `hubot what status is mailer` - Get status of mailer
//   - `hubot what version is mailer` - Get version of mailer
//   - `hubot which is last mailer` - Get latest released version of mailer
//
// Commands:
//   hubot what status is (frontend|core|events|statutory|discounts|mailer)
//   hubot what version is (frontend|core|events|statutory|discounts|mailer)
//   hubot which is last (frontend|core|events|statutory|discounts|mailer)
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
        let message = data.success ? `Service ${service} has version ${data.data.version} deployed` : "Something went wrong!"
        return res.send(message)
      } catch (error) {
          robot.logger.error(error)
          return res.send("Ran into an error parsing JSON :(")
      }
    })
  })
  
  robot.hear(/which is last (frontend|core|events|statutory|discounts|mailer)/i, (res) => {
      
    const service = res.match[1]
    const base_url = `https://api.github.com/repos/AEGEE/${service}/git/refs/tags`

    robot.http(base_url)
      .header('Accept', 'application/json')
      .get() ( (err, response, body) => {

      // err & response status checking code here
      if (err != null || response.headers['content-type'].indexOf('application/json') === -1) {
        robot.logger.error(err)
        return res.send("An error occurred, or the answer was not JSON :(")
      }

      try {
        const data = JSON.parse(body)
        let message = `Last released version of ${service} is ${data[data.length-1].ref.replace('refs/tags/', '')}`
        return res.send(message)
      } catch (error) {
          robot.logger.error(error)
          return res.send("Ran into an error parsing JSON :(")
      }
    })
  })

}
