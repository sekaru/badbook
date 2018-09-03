import { Component } from 'inferno'
import './PostForm.css'
import { Consumer } from '../context/Context'

export default class PostForm extends Component {
    state = {
        text: "",
        backgroundColour: "",
        textColour: "",
        hideAuthor: false
    }

    render() {
        return (
            <div className="statusForm">
                <Consumer>
                    {context => (
                        <textarea 
                            style={{background: this.state.backgroundColour, color: this.state.textColour, fontSize: context.fontSize(this.state.text) + "rem"}} 
                            placeholder="Complain about something. It's free."
                            type="text" 
                            onInput={e => this.setState({text: e.target.value})} 
                            value={this.state.text}
                        />                                               
                    )}
                </Consumer>

                <div className="toolbar">
                    <Consumer>
                        {context => (
                            <button onClick={() => this.post(context)}>Post</button>                                                    
                        )}
                    </Consumer>
                    
                    <div className="control">
                        Background colour
                        <input type="color" onInput={e => this.setState({backgroundColour: e.target.value})} value={this.state.backgroundColour} />
                    </div>

                    <div className="control">
                        Text colour
                        <input type="color" onInput={e => this.setState({textColour: e.target.value})} value={this.state.textColour} />
                    </div>

                    <Consumer>
                        {context => (
                            <div>
                                {
                                    context.state.user ?
                                    <div className="control">
                                        Post anonymously
                                        <input type="checkbox" onInput={e => this.setState({hideAuthor: e.target.checked})} value={this.state.hideAuthor} />
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )}
                    </Consumer>
                </div>
            </div>
        )
    }

    post(context) {
        if(this.state.text.length===0) return

        context.addPost(this.state)
        this.setState({
            text: ""
        })
    }
}