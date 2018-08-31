import { Component } from 'inferno'
import './Chip.css'

export default class Chip extends Component {
  render() {
    return (
      <div className="chip" style={{background: this.props.colour}}>
        {this.props.text}
      </div>
    )
  }
}