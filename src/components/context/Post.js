export const addPost = (loc, user, post, callback) => {
    if(!user) user = "anonymous"

    fetch(loc + "/posts", {method: 'post', body: JSON.stringify({user: user, post: post})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const react = (loc, id, user, emoji, callback) => {
    // can't vote if anonymous
    if(user==null) {
        alert("You need to be logged in to react")
        return
    }

    fetch(loc + "/react", {method: 'post', body: JSON.stringify({postid: id, user: user, emoji: emoji})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}