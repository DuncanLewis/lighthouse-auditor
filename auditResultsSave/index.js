var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();
AWS.config.update({
    region: 'eu-west-1'
});

module.exports.handler = (event, context, callback) => {
    // Create the DynamoDB service object
    ddb = new AWS.DynamoDB({
        apiVersion: '2012-10-08'
    });

    var params = {
        TableName: 'dev-auditsTable',
        Item: {
            'url': {
                S: event.target
            },
            'score': {
                S: event.score
            },
        }
    };

    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}