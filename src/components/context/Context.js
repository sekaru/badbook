import { Component } from 'inferno'
import createInfernoContext from 'create-inferno-context'
import * as UserFuncs from './User'
import * as PostFuncs from './Post'
import Cookies from 'universal-cookie'
import { url } from '../../utils/common'

const cookies = new Cookies()

const Context = createInfernoContext()

export class ContextProvider extends Component {
    state = {
        user: null,
        stats: null,
        posts: null,
    }

    componentWillMount() {
        fetch(url + "/posts")
        .then(res => {
            return res.json()
        })
        .then(resJson => {
            if(!resJson.posts) {
                // stop the loading spinner
                this.setState({posts: []})
            } else {
                this.setState({posts: resJson.posts})
            }
        })
    }

    register = (user, callback) => {
        UserFuncs.register(user, resJson => {
            if(!resJson.resp) {
                alert(resJson.msg)
                callback(1)             
                return
            }
    
            // set the user and update the account box's mode
            this.setUser(resJson)
            callback(3)
        })
    }

    login = (user, callback) => {
        UserFuncs.login(user, resJson => {
            if(!resJson.resp) {           
                alert(resJson.msg)
                callback(2)
                return
            }

            // set the user and update the account box's mode
            this.setUser(resJson)
            callback(3)
        })
    }

    cookieLogin = (res, callback) => {
        this.setUser(res)
        callback()
    }

    setUser = (res) => {
        this.setState({user: res.name})

        cookies.set('user', res.name + "/" + res.token)

        // request stats
        UserFuncs.getStats(res.name, resJson => {
            if(!resJson.resp) {           
                alert(resJson.msg)
                return
            }

            this.setState({stats: resJson.stats})
        })
    }

    getHint = (name, callback) => {
        // get their password hint
        UserFuncs.getHint(name, resJson => {
            if(!resJson.resp) {           
                alert(resJson.msg)
                callback(null)
                return
            }

            callback(resJson.hint)
        })
    }

    logout = () => {
        UserFuncs.logout(cookies.get('user'))
        this.setState({name: null, stats: null})

        cookies.remove('user')
    }

    getPost = (id) => {
        return this.state.posts.find(post => {
            return post.id===id
        })
    }

    addPost = (post) => {
        PostFuncs.addPost(this.state.user, post, resJson => {
            if(!resJson.resp) {
                alert(resJson.msg)
                return
            }
    
            // add this post to the front
            let posts = this.state.posts
            posts.unshift(resJson.post)
            this.setState({posts})

            // increment their stats
            let stats = this.state.stats
            stats.count++
            this.setState({stats})
        })
    }

    react = (id, emoji) => {
        PostFuncs.react(id, this.state.user, emoji, resJson => {
            if(!resJson.resp) {
                alert(resJson.msg)
                return
            }

            // find and update the post
            let posts = this.state.posts
            let post = posts.find(post => {
                return post.id === id
            })
            post.reacts = resJson.post.reacts

            this.setState({posts})
        })
    }

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                register: this.register,
                login: this.login,
                cookieLogin: this.cookieLogin,
                getHint: this.getHint,
                logout: this.logout,
                fontSize: this.fontSize,
                addPost: this.addPost,
                react: this.react
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

    fontSize = (text) => {
        let length = text.length
        
        if(length >= 800) {
          return 0.9
        } else if(length>=400) {
          return 1.2
        } else if(length>=100) {
          return 1.5
        } else {
          return 1.8
        }
    }
}

export const Consumer = Context.Consumer