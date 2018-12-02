const lighthouse = require('lighthouse')
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuid/v5')

module.exports.handler = (event, context, callback, chrome) => {
    console.log(event)

    const flags = {
        disableDeviceEmulation: !event.mobile || true,
        disableCpuThrottling: true,
        disableNetworkThrottling: true
    }

    lighthouse(event.target, flags).then(function(results) {
        ddb = new AWS.DynamoDB({
            apiVersion: '2012-10-08'
        });

        s3 = new AWS.S3()

        const hash = uuidv4()
        const s3key = `${uuidv5(event.target, uuidv5.URL)}/${hash}`
        const bucketName = 'lighthouse-auditor-dev-resultsbucket-b04a5n6lygnz'
        
        const date = new Date();

        var params = {
            s3: {
                Bucket: bucketName,
                Key: s3key,
                Body: JSON.stringify(results),
                ContentType: 'application/json'
            },
            ddb: {
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
            }
        }

        return params
    }).then(function(params) {
        s3.putObject(params.s3, function (err, data) {
            if (err) {  
                console.log("Error", err);
                callback(err);
            } else {
                console.log("Success", data);
                callback(null, data);
            }
        });
        ddb.putItem(params.ddb, function (err, data) {
            if (err) {  
                console.log("Error", err);
                callback(err);
            } else {
                console.log("Success", data);
                callback(null, data);
            }
        });
    });
}