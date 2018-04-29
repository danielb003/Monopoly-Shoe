import React, { Component } from 'react';
import './App.css';
import Home from './Home';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         page: 'Home'
      }
   }

    render() {
        return (
           <div className="App">
           </div>
        )
    }
}

export default App;
