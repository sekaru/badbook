import { Component } from 'inferno'
import './Card.css'
import { Consumer } from '../context/Context'
import Chip from '../chip/Chip'
import { emoji } from '../../utils/common'

export default class Card extends Component {
  render() {
    return (
      <div className="card" style={{background: this.props.backgroundColour}}>
        <comment style={{color: this.props.textColour}}>
            <Consumer>
              {context => (
                <p style={{fontSize: context.fontSize(this.props.text) + "rem"}}>{this.props.text}</p>
              )}
            </Consumer>
        </comment>

        <div className="author" style={{color: this.props.textColour}}>Posted by {this.author()}</div>
        
        {this.renderReactions()}
      </div>
    )
  }

  author() {
      return this.props.hideAuthor ? "anonymous" : this.props.author
  }

  renderReactions() {
      return (
        <div className="reactions">
            {emoji.map((e, index) => this.toEmoji(e, index))}                       
        </div>
      )
  }

  toEmoji(e, index) {
    return (
        <Consumer>
            {context => (
                <span className="emojiContainer">
                    {/* Emoji character */}
                    <span onClick={() => context.react(this.props.id, index)} className="emoji" role="img" arial-label="Reaction">{e}</span>

                    {/* Number of reacts */}
                    <Chip colour={this.props.reacts[index].includes(context.state.user) ? "#333" : null} text={this.props.reacts[index].length} />
                </span>
            )}
        </Consumer>        
    )
  }
}