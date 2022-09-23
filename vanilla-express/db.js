var debug = require('debug')('vanilla-express:db');

//todo: add aws sdk npm package and require

process.env.AWS_PROFILE='devrex'


//todo: create a dynamodb document client

//todo: find table name
const tableName = ""

// https://dynobase.dev/dynamodb-nodejs/



async function add(alias, url) {
//todo: call put on the documentClient
}

async function click(alias) {
//todo: call update on the documentClient
}

async function find(pattern) {
//todo: call scan on the documentClient
}

module.exports = {
    add, click, find
}