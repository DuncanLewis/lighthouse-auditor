const lighthouse = require('lighthouse')
const AWS = require('aws-sdk')
const uuidv5 = require('uuid/v5')

module.exports.handler = (event, context, callback, chrome) => {
    console.log(event)

    const flags = {
        disableDeviceEmulation: !event.mobile || true,
        disableCpuThrottling: true,
        disableNetworkThrottling: true
    }
    console.log(flags)

    lighthouse(event.target, flags).then(function(results) {
        console.log('timestamp: ' + results.generatedTime)
        console.log('target: ' + results.url)
        console.log('total-time: ' + results.timing.total)
        console.log('score: ' + results.score)
        
        ddb = new AWS.DynamoDB({
            apiVersion: '2012-10-08'
        });

        const date = new Date();
    
        var params = {
            TableName: 'dev-auditsTable',
            Item: {
                'id': {
                    S: uuidv5(results.url, uuidv5.URL)
                },
                'url': {
                    S: results.url
                },
                'score': {
                    S: results.score.toString()
                },
                'time': {
                    N: date.getTime().toString()
                }
            }
        };

        return params
    }).then(function(params) {
        ddb.putItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                callback(err);
            } else {
                console.log("Success", data);
                callback(null, data);
            }
        });
    })
}