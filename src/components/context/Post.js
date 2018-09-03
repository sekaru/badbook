import { url } from '../../utils/common'

export const addPost = (post, callback) => {
    fetch(url + "/posts", {method: 'post', credentials: 'include', body: JSON.stringify({post: post})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const react = (id, emoji, callback) => {
    fetch(url + "/react", {method: 'post', credentials: 'include', body: JSON.stringify({postid: id, emoji: emoji})})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}