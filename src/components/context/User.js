import { url } from '../../utils/common'

export const register = (user, callback) => {
    if(user.pass!==user.pass2) {
        alert("Those passwords don't match!")
        return
    }

    fetch(url + "/register", {method: 'post', body: JSON.stringify(user)})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const login = (user, callback) => {
    fetch(url + "/login", {method: 'post', body: JSON.stringify(user)})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const cookieLogin = () => {
    return fetch(url + "/cookielogin", {method: 'post', credentials: 'include'})
    .then(res => {
        return res.json()
    })
}

export const getStats = (callback) => {
    return fetch(url + "/stats", {credentials: 'include'})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const getHint = (user, callback) => {
    return fetch(url + "/hint/" + user)
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const logout = () => {
    fetch(url + "/logout", {method: 'post', credentials: 'include'})
}