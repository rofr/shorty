var debug = require('debug')('vanilla-express:db');

debug('db loading...')

let items = 
    {
        'cdk-docs' : {
            'url' : 'https://docs.aws.amazon.com/cdk/api/v2/',
            'clicks' : 42
        },
        'col' : {
            'url' : 'https://www.khanacademy.org/science/ap-biology/chemistry-of-life',
            'clicks' : 1
        }
    }

async function add(alias, url) {
    if (items[alias]) return false
    items[alias] = {url, clicks:0}
    return true
}

async function click(alias) {
    let item = items[alias]
    if (item) {
        item.clicks++
        return item.url
    }
    return null
}

async function find(pattern) {
    let result = []
    const max = 100
    for(alias in items) {
        if (alias.indexOf(pattern) >= 0) result.push({...items[alias],alias})
        if (result.length > max) break
    }
    return result

}

module.exports = {
    add, click, find
}