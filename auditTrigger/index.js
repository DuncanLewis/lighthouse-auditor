const AWS = require('aws-sdk')

module.exports.handler = (event, context, callback) => {
    const ddb = new AWS.DynamoDB({
        apiVersion: '2012-10-08'
    });

    const sns = new AWS.SNS();

    let params = {
        TableName: 'lighthouse-auditor--dev-sitesTable'
    };

    ddb.scan(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            data.Items.forEach(function(element, index, array) {
                console.log(element);
            });
        }
    });
}