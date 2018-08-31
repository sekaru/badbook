import { Component } from 'inferno'
import './AccountBox.css'
import { Consumer } from '../context/Context'
import Spinner from '../spinner/Spinner'
import Chip from '../chip/Chip'
import Cookies from 'universal-cookie'
import menu from '../../assets/menu.png'

const cookies = new Cookies()

export default class AccountBox extends Component {
    state = {
        show: true,
        name: "",
        pass: "",
        pass2: "",
        hint: "",
        requestingHint: false,
        requestingStats: false,
        tempUser: null
    }

    componentWillMount() {
        // try to login with our cookie
        if(cookies.get('user')) {
            this.setMode(4)

            fetch("https://5hukltdu5f.execute-api.us-east-1.amazonaws.com/dev/cookielogin", {method: 'post', body: JSON.stringify({user: cookies.get('user')})})
            .then(res => {
                return res.json()
            })
            .then(resJson => {
                if(resJson.resp) {
                    // our auth token was valid, let the context know we have a temp user
                    cookies.set('user', resJson.name + "/" + resJson.token)
                    this.setState({tempUser: resJson})
                } else {
                    this.setMode(0)
                }
            })
        }
    }

    render() {
        if(!this.state.show) return (
            <div className="account hidden">
                <img src={menu} alt="Menu" onClick={() => this.setState({show: true})} />
            </div>
        )

        switch(this.state.mode) {
            default:
            case 0:
                return this.renderDefault()
            case 1:
                return this.renderRegister()
            case 2:
                return this.renderLogin()
            case 3:
                return this.renderUser()
            case 4:
                return this.renderSpinner()
        }
    }

    setMode(mode) {
        this.setState({mode: mode})
    }

    renderDefault() {
        return (
            <div className="account">
                <p>Make an account to rate posts and see stats. No email required.</p>
                <button onClick={() => this.setMode(1)}>Register</button>
                <span onClick={() => this.setState({show: false})} className="smallText closeAccountBox">Not right now</span>

                <br /><br />
                <p>Already have an account?</p>
                <button onClick={() => this.setMode(2)}>Login</button>
            </div>
        )
    }

    renderRegister() {
        return (
            <Consumer>
                {context => (
                    <div className="account">
                        {/* Username */}
                        <p>Choose a username <br/><span className="smallText">(you can still remain anonymous)</span></p>
                        <input 
                            type="text" 
                            onInput={e => this.setState({name: e.target.value})} 
                            value={this.state.name} />  

                        {/* Password */}
                        <p>Choose a password</p>
                        <input 
                            type="password" 
                            onInput={e => this.setState({pass: e.target.value})} 
                            value={this.state.pass} />  
                        
                        {/* Repeat password */}
                        <p>Repeat that password</p>
                        <input 
                            type="password" 
                            onInput={e => this.setState({pass2: e.target.value})} 
                            value={this.state.pass2} />  
                        
                        {/* Password hint */}
                        <p>Choose a password hint <br/><span className="smallText">(optional)</span></p>
                        <input 
                            type="text" 
                            onInput={e => this.setState({hint: e.target.value})} 
                            value={this.state.hint} />            

                        <br/><br/>
                        <button onClick={() => this.register(context)}>Register</button>
                        <button className="closeAccountBox" onClick={() => this.setMode(0)}>Cancel</button>
                    </div>
                )}
            </Consumer>
        )
    }

    renderLogin() {
        return (
            <Consumer>   
                {context => (
                    <div className="account">
                        {/* Username */}
                        <p>Username</p>
                        <input 
                            type="text" 
                            onInput={e => this.setState({name: e.target.value})} 
                            value={this.state.name} />  

                        {/* Password */}
                        <p>Password</p>
                        <input 
                            type="password" 
                            onInput={e => this.setState({pass: e.target.value})} 
                            value={this.state.pass} /> 

                        {/* Hint */}
                        {this.state.name ? this.renderHint(context) : <div><br/><br/></div>}
                                    
                        <button onClick={() => this.login(context)}>Login</button>
                        <button className="closeAccountBox" onClick={() => this.setMode(0)}>Cancel</button>
                    </div>
                )}         
            </Consumer>
            
        )
    }

    renderHint(context) {
        return (
            <div>
                {
                    this.state.hint ? 
                    <p className="smallText" style={{cursor: "pointer", marginBottom: "2em"}}>Your hint is ' {this.state.hint} '</p> 
                    :
                    <div>
                        {
                            this.state.requestingHint ? 
                            <div style={{margin: "1em 0"}}><Spinner noMargin /></div>
                            :
                            <p onClick={() => this.requestHint(context)} className="smallText" style={{cursor: "pointer", marginBottom: "2em"}}>Request your hint</p> 
                        }
                    </div>
                }
            </div>
        )
    }

    renderSpinner() {
        return (
            <Consumer>
                {context => (
                    <div className="account">
                        <Spinner noMargin />
                        {this.checkCookieLogin(context)}
                    </div>
                )}
            </Consumer>
        )
    }

    renderUser() {
        return (
            <Consumer>
                {context => (
                    <div className="account">
                        <h2>Hey {context.state.user}</h2>
                        {this.renderStats(context)}
                    </div>
                )}
            </Consumer>
        )
    }

    renderStats(context) {
        if(!context.state.stats) return (
            <div>
                <Spinner noMargin />
            </div>
        )

        return (
            <div>
                <p>You've made {context.state.stats.count} {context.state.stats.count===1 ? "post" : "posts"}</p>
                <div className="reacts">                                        
                {
                    ["👍", "🙌", "😂", "👏", "👎"].map((emoji, index) => {
                        return <div className="emojiContainer">{emoji} <Chip colour="#333" text={context.state.stats.reacts[index]} /></div>
                    })
                }  
                </div>     
                
                <br/>
                <button onClick={() => this.logout(context)}>Logout</button>  
                <button className="closeAccountBox" onClick={() => this.setState({show: false})}>Hide</button>                              
            </div>
        )
    }

    login(context) {
        context.login(this.makeUser(), (mode) => {
            this.setMode(mode)
        })
    }

    checkCookieLogin(context) {
        if(this.state.tempUser && !context.state.user) {
            context.cookieLogin(this.state.tempUser, () => {
                this.setMode(3)
            })
        }
    }

    register(context) {
        context.register(this.makeUser(), (mode) => {
            this.setMode(mode)
        })

        this.setState({name: "", pass: "", pass2: "", hint: ""})
    }

    logout(context) {
        context.logout()
        this.setMode(0)
    }

    makeUser() {
        this.setMode(4)

        return {
            name: this.state.name,
            pass: this.state.pass,
            pass2: this.state.pass2,
            hint: this.state.hint
        }
    }

    requestHint(context) {
        if(!this.state.name) return

        this.setState({requestingHint: true})
        context.getHint(this.state.name, hint => {
            this.setState({requestingHint: false, hint: hint})
        })
    }
}