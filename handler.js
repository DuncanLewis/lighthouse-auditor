// https://github.com/GoogleChrome/lighthouse
const lighthouse = require('lighthouse')
// https://github.com/dbader/node-datadog-metrics
//const metrics = require('datadog-metrics')

module.exports.audit = (event, context, callback, chrome) => {

    // event = {
    //   "target": "https://shop.nordstrom.com",
    //   "mobile": false
    // }
    console.log(event)

    // Flags for launching lighhouse
    // ref: https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/configuration.md
    const flags = {
        disableDeviceEmulation: !event.mobile || true,
        disableCpuThrottling: true,
        disableNetworkThrottling: true
    }

    // Initialize datadog metrics collection
    // ref: https://github.com/dbader/node-datadog-metrics#initialization
    // metrics.init({
    //     host: 'host',
    //     prefix: 'prefix.',
    //     flushIntervalSeconds: 0,
    //     apiKey: process.env.DATADOG_API_KEY,
    //     appKey: process.env.DATADOG_APP_KEY,
    //     defaultTags: [`audit-target:${event.target}`]
    // })

    // Attach lighthouse to chrome and run an audit.
    // ref: https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
    lighthouse(event.target, flags).then(function(results) {
        console.log('timestamp: ' + results.generatedTime)
        console.log('target: ' + results.url)
        console.log('total-time: ' + results.timing.total)
        console.log('score: ' + results.score)
    })
}