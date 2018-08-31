module.exports.res = function() {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }
}

module.exports.hasAllParams = function(body, params, res) {
    const hasAll = params.every(item => {
        return body.hasOwnProperty(item);
    })

    if(!hasAll) {
        res.statusCode = 400
        res.body = JSON.stringify({resp: false, msg: "Missing required details"})
    }
    
    return hasAll
}