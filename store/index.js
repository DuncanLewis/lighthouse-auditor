const AWS = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
    ddb = new AWS.DynamoDB({
        apiVersion: '2012-10-08'
    });

    const params = {
        TableName: 'dev-auditsTable',
        Item: {
            'audit_id': {
                N: '001'
            },
            'results': {
                M: event.results
            }
        }
    }

    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}