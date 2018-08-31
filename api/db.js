const dynamo = require('./dynamodb')
const uuid = require('uuid')

module.exports.get = (params, callback) => {
  dynamo.get(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}

module.exports.create = (params, callback) => {
  dynamo.put(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}

module.exports.list = (params, callback) => {
  dynamo.scan(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}

module.exports.delete = (params, callback) => {
  dynamo.delete(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}

module.exports.updatePost = (post, callback) => {
  const params = {
    TableName: process.env.POSTS_TABLE,
    Key: {
      id: post.id
    },
    UpdateExpression: "set reacts=:r",
    ExpressionAttributeValues:{
        ":r": post.reacts,
    },
    ReturnValues:"UPDATED_NEW"
  }

  dynamo.update(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}

module.exports.updateToken = (name, callback) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      name: name
    },
    UpdateExpression: "set auth_token=:t",
    ExpressionAttributeValues:{
        ":t": uuid.v4(),
    },
    ReturnValues:"UPDATED_NEW"
  }

  dynamo.update(params, (err, result) => {
    if(err) {
      console.error(err)
      return callback(err)
    }

    return callback(null, result)
  })
}