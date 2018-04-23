import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'

export default class Logout extends Component {
   constructor(props) {
      super(props)
      this.state= {
         redirect: false
      }
   }

   componentWillMount() {
      app.auth().signOut().then((user, error) => {
         this.setState({ redirect: true })
      });
   }

   render() {
      if(this.state.redirect === true) {
         return <Redirect to="/" />
      }

      return(
         <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
            <h3 style={{ color: "rgb(220,220,220" }}>Logging Out...</h3>
         </div>
      )
   }
}