const db = require('./db')

parseCookies = (header) => {
    let obj = {}
    if(!header) return obj
    
    let cookies = header.split("; ")

    cookies.forEach(cookie => {
        obj[cookie.split("=")[0]] = cookie.split("=")[1]
    })

    return obj
}

module.exports.res = () => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }
}

module.exports.token = (event) => {
    let cookies = parseCookies(event.headers.Cookie)
    if(!cookies['user']) return null
    return cookies['user']
}

module.exports.hasAllParams = (body, params, res) => {
    const hasAll = params.every(item => {
        return body.hasOwnProperty(item);
    })

    if(!hasAll) {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "Missing required details"})
    }
    
    return hasAll
}

module.exports.getUser = (key, val) => {
    // get a single user
    return new Promise((resolve, reject) => {
        db.list({
            TableName: process.env.USERS_TABLE
        }, (err, result) => {
            if(err) return reject(err)

            const users = result.Items
            const user = users.find(user => {
                return user[key]===val
            })

            resolve(user)
        })
    })
}