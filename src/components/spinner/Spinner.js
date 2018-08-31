import { Component } from 'inferno'
import './Spinner.css'

export default class Spinner extends Component {
    render() {
        let className = "container"
        if(this.props.noMargin) className+=" noMargin"

        return (
            <div className={className}>
                <div class="lds-ripple"><div></div><div></div></div>                
            </div>
        )
    }
}