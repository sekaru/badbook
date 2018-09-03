import { url } from '../../utils/common'
import { getToken } from '../../utils/cookies'

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
    return fetch(url + "/cookielogin", {method: 'post', body: JSON.stringify({token: getToken()})})
    .then(res => {
        return res.json()
    })
}

export const getStats = (callback) => {
    return fetch(url + "/stats/" + getToken())
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
    fetch(url + "/logout", {method: 'post', body: JSON.stringify({token: getToken()})})
}