var debug = require('debug')('vanilla-express:db');

// https://dynobase.dev/dynamodb-nodejs/
const AWS = require("aws-sdk")

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-1",
})

const tableName = process.env.TABLE_NAME




async function add(alias, url) {
    try {
        let response = await documentClient.put({
            TableName: tableName,
            Item: {
                alias,
                url,
                clicks: 0
            },
            ConditionExpression: 'attribute_not_exists(alias)'
        }).promise()
        return true
    } catch (error) {
        console.error(error)
    }
}

async function click(alias) {
    try {
        let res = await documentClient.update({
            TableName: tableName,
            Key: {
                alias
            },
            UpdateExpression: 'set clicks = clicks + :one',
            ExpressionAttributeValues: { ':one': 1 },
            ReturnValues: 'ALL_OLD'
        })
            .promise()
        console.log(res)
        return res.Attributes.url
    } catch (error) {
        console.error(error)
        return null
    }
}

async function find(pattern) {
    var res = await documentClient.scan({
        TableName: tableName,
        FilterExpression: "contains(alias, :alias)",
        ExpressionAttributeValues: {
          ":alias": pattern,
        },
    }).promise()
      return res.Items;
}

module.exports = {
    add, click, find
}