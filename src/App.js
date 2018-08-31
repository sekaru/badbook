import { Component } from 'inferno'
import './registerServiceWorker'
import './App.css'
import PostForm from './components/postform/PostForm'
import Card from './components/card/Card'
import Spinner from './components/spinner/Spinner'
import AccountBox from './components/accountbox/AccountBox'
import { ContextProvider, Consumer } from './components/context/Context';

export default class App extends Component {
  render() {
    return (
      <ContextProvider>
        <div className="app">
          <header>
            <h1>badbook</h1>          
          </header>

          <AccountBox/>            

          {this.renderFeed()}
        </div>
      </ContextProvider>      
    )
  }

  renderFeed() {
    return (
      <Consumer>
        {context => (
          <div>
            {/* Posting form */}
            <PostForm/>            

            {/* Posts */}
            <div className="cards">
              {
                context.state.posts!==null ? context.state.posts.map(card => {
                  return (
                    <Card {...card} />
                  )
                })
                :
                // Loading
                <Spinner/>                
              }
            </div>
          </div>              
        )}
      </Consumer>
    )
  }
}