import { url } from '../../utils/common'
import { getToken } from '../../utils/cookies'

export const addPost = (post, callback) => {
    fetch(url + "/posts", {method: 'post', body: JSON.stringify({post: post, token: getToken()})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const react = (id, emoji, callback) => {
    fetch(url + "/react", {method: 'post', body: JSON.stringify({postid: id, emoji: emoji, token: getToken()})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}