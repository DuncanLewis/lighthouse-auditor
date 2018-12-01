const lighthouse = require('lighthouse')
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuid/v5');

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

        s3 = new AWS.S3();

        const s3key = `${uuidv5.URL(event.target)}/${uuidv4}`
        const bucketName = 'lighthouse-auditor-dev-resultsbucket-b04a5n6lygnz'

        s3.putObject({
            Bucket: bucketName,
            Key: s3key,
            Body: JSON.stringify(results),
            ContentType: 'application/json'
        });
        
        const date = new Date();
    
        var params = {
            TableName: 'lighthouse-auditor--dev-auditsTable',
            Item: {
                'id': {
                    S: uuidv4()
                },
                'url': {
                    S: results.url
                },
                'score': {
                    S: results.score.toString()
                },
                's3Key': {
                    S: `s3://${bucketName}/${s3key}`
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