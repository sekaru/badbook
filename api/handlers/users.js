'use strict'

const db = require('../db')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const helpers = require('../helpers')

function getUser(name) {
    // get a single user
    return new Promise((resolve, reject) => {
        db.list({
            TableName: process.env.USERS_TABLE
        }, (err, result) => {
            if(err) return reject(err)

            const users = result.Items
            const user = users.find(user => {
                return user.name===name
            })

            resolve(user)
        })
    })
}

function getUserStats(name) {
    return new Promise((resolve, reject) => {
        db.list({
            TableName: process.env.POSTS_TABLE
        }, (err, result) => {
            if(err) return reject(err)

            const posts = result.Items
            let count = 0
            let reacts = [0, 0, 0, 0, 0]

            posts.forEach(post => {
                if(post.author===name) {
                    // increase the number of posts if it's theirs
                    count++

                    // find their name in reacts to other posts                    
                    for(let i=0; i<reacts.length; i++) {
                        reacts[i]+=post.reacts[i].length
                    }
                }
            })

            let stats = {
                count: count,
                reacts: reacts
            }

            resolve(stats)
        })
    })
}

function updateToken(name) {
    return new Promise((resolve, reject) => {
        db.updateToken(name, (err, result) => {
            if(err) reject(err)
            resolve(result.Attributes.auth_token)
        })
    })
}

module.exports.register = async (event, context) => {
    const body = JSON.parse(event.body)

    let res = helpers.res()

    // check they've sent everything over
    if(!helpers.hasAllParams(body, ['name', 'pass'], res)) return res

    // try and find a duplicate user
    const user = await getUser(body.name)

    // found one, exit out
    if(user) {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "That name is taken"})
        return res
    }
   
    await new Promise((resolve, reject) => {
        // hash the password
        bcrypt.hash(body.pass, 10, (err, hash) => {
            let user = {
                name: body.name,
                pass: hash,
                auth_token: uuid.v4()
            }
            if(body.hint) user.hint = body.hint

            // push them to the db
            db.create({
                TableName: process.env.USERS_TABLE,
                Item: user,
            }, (err, result) => {
                if(err) return reject(err)
            
                res.body = JSON.stringify({resp: true, name: user.name, token: user.auth_token})
                resolve()
            })
        })
    })

    return res
}

module.exports.login = async (event, context) => {
    const body = JSON.parse(event.body)

    let res = helpers.res()

    // check they've sent everything over
    if(!helpers.hasAllParams(body, ['name', 'pass'], res)) return res

    // check that user exists
    const user = await getUser(body.name)

    if(!user) {
        res.statusCode = 404
        res.body = JSON.stringify({resp: false, msg: "That user doesn't exist"})
        return res
    }

    // compare the passwords
    const result = await new Promise((resolve, reject) => {
        bcrypt.compare(body.pass, user.pass, (err, res) => {
            if(err) reject(err)
            resolve(res)
        })
    })

    if(result) {
        // set a new token
        const token = await updateToken(body.name)

        res.body = JSON.stringify({resp: true, name: user.name, token: token})
    } else {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "Incorrect password"})
    }

    return res
}

module.exports.cookielogin = async (event, context) => {
    const body = JSON.parse(event.body)

    let res = helpers.res()

    // check they've sent everything over
    if(!helpers.hasAllParams(body, ['user'], res)) return res

    const delimiter = "/"
    const name = body.user.split(delimiter)[0]
    const token = body.user.split(delimiter)[1]

    // check that user exists
    const user = await getUser(name)

    if(!user) {
        res.statusCode = 404
        res.body = JSON.stringify({resp: false, msg: "That user doesn't exist"})
        return res
    }

    // compare the passwords
    const result = user.auth_token===token

    if(result) {
        // set a new token
        const newToken = await updateToken(name)

        res.body = JSON.stringify({resp: true, name: user.name, token: newToken})
    } else {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "Invalid auth token"})
    }

    return res
}

module.exports.logout = async (event, context) => {
    const body = JSON.parse(event.body)

    let res = helpers.res()

    // check they've sent everything over
    if(!helpers.hasAllParams(body, ['user'], res)) return res

    const delimiter = "/"
    const name = body.user.split(delimiter)[0]
    const token = body.user.split(delimiter)[1]

    // check that user exists
    const user = await getUser(name)

    if(!user) {
        res.statusCode = 404
        res.body = JSON.stringify({resp: false, msg: "That user doesn't exist"})
        return res
    }

    // check the token is valid
    if(token!==user.auth_token) {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "Invalid auth token"})
        return res
    }

    // update their token
    await updateToken(name)

    res.body = JSON.stringify({resp: true})

    return res
}

module.exports.hint = async (event, context) => {
    let res = helpers.res()

    // check that user exists
    const user = await getUser(event.pathParameters.name)

    if(!user) {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "That user doesn't exist"})
        return res
    }

    // no hint
    if(!user.hint) {
        res.statusCode = 400        
        res.body = JSON.stringify({resp: false, msg: "You have no hint set"})        
        return res
    }

    // send the hint
    res.body = JSON.stringify({resp: true, hint: user.hint})

    return res
}

module.exports.stats = async (event, context) => {
    let res = helpers.res()

    // check that user exists
    const user = await getUser(event.pathParameters.name)

    if(!user) {
        res.statusCode = 404
        res.body = JSON.stringify({resp: false, msg: "That user doesn't exist"})
        return res
    }

    const stats = await getUserStats(user.name)

    // send the hint
    res.body = JSON.stringify({resp: true, stats: stats})

    return res
}