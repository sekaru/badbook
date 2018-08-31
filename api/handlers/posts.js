'use strict'

const db = require('../db')
const uuid = require('uuid')
const helpers = require('../helpers')

function getPost(id) {
    // get a single post
    return new Promise((resolve, reject) => {
        db.list({
            TableName: process.env.POSTS_TABLE
        }, (err, result) => {
            if(err) return reject(err)

            const posts = result.Items
            const post = posts.find(post => {
                return post.id===id
            })

            resolve(post)
        })
    })
}

module.exports.newpost = async (event, context) => {
    const body = JSON.parse(event.body)

    let res = helpers.res()

    // check they've sent everything over
    if(!helpers.hasAllParams(body, ['user', 'post'], res)) return res

    // character limits
    if(body.post.text.length>2500) body.post.text = body.post.text.substring(0, 2500)

    let post = {
        id: uuid.v4(),
        author: body.user,
        text: body.post.text,
        reacts: [[], [], [], [], []],
        hideAuthor: body.post.hideAuthor || false,
        timestamp: + new Date()
    }

    // optional colour stuff
    if(body.post.backgroundColour) post.backgroundColour = body.post.backgroundColour
    if(body.post.textColour) post.textColour = body.post.textColour    

    await new Promise((resolve, reject) => {
        // push the post to the db
        db.create({
            TableName: process.env.POSTS_TABLE,
            Item: post,
        }, (err, result) => {
            if(err) return reject(err)
        
            res.body = JSON.stringify({resp: true, post: post})
            resolve()
        })
    })

    return res
}

module.exports.getposts = async (event, context) => {
    let res = helpers.res()

    const posts = await new Promise((resolve, reject) => {
        db.list({
            TableName: process.env.POSTS_TABLE
        }, (err, result) => {
            if(err) return reject(err)

            let posts = result.Items

            // sort by timestamp
            posts.sort((a, b) => {
                return b.timestamp-a.timestamp
            })
            resolve(posts)
        })
    })
    
    res.body = JSON.stringify({resp: true, posts: posts})

    return res
}

module.exports.react = async (event, context) => {
    const body = JSON.parse(event.body)
    const user = body.user
    const emoji = body.emoji

    let res = helpers.res()

    // check that post exists
    let post = await getPost(body.postid)  
    
    if(!post) {
        res.statusCode = 400        
        res.body = JSON.stringify({resp: false, msg: "That post does not exist!"})
        return res
    }

    let prevVote
    if(post.author!==user) {
        for(let i=0; i<post.reacts.length; i++) {
            // find if they've already voted for one
            if(post.reacts[i].includes(user)) {
                post.reacts[i].splice(post.reacts[i].indexOf(user))
                prevVote = i
                break
            }
        }

        // only push if they haven't clicked the same one
        if(prevVote!==emoji) post.reacts[emoji].push(user)  
        
        // update the post
        db.updatePost(post, (err, result) => {
            post = result
        })
    } else {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "You can't react to your own post!"})
        return res
    }
    
    res.body = JSON.stringify({resp: true, post: post})

    return res
}
