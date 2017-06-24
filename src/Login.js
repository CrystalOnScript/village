import React, { Component } from 'react';
import firebase from 'firebase';


// Initialize Firebase
const config = {
    apiKey: "AIzaSyC6UWBWM3mswRaLQFj-oDxSPmRTnbHWvjg",
    authDomain: "yourvillage-bbea7.firebaseapp.com",
    databaseURL: "https://yourvillage-bbea7.firebaseio.com",
    projectId: "yourvillage-bbea7",
    storageBucket: "",
    messagingSenderId: "740574341979"
  };
firebase.initializeApp(config);





class Login extends Component {

  componentWillMount(){
    firebase.auth().onAuthStateChanged(function(auth) {

        const user = firebase.auth().currentUser;

        //User authenticated and active session begins.
        if (auth != null) {
          console.log('User authenticated: ' + user.displayName);
          console.log(user);
          let err = "Welcome, " + user.displayName;
          this.setState({err: err});
        //User isn't authenticated.
        } else {
          console.log('User not authenticated.');
        }


      }.bind(this));
  };

  logout(event){
    firebase.auth().signOut();
    let lout = document.getElementById("logoutButton");
    lout.classList.add("hide")

    let err = "Thanks!";
    this.setState({err: err});
  }

  google(){
    console.log("this is google method")

    let provider = new firebase.auth.GoogleAuthProvider();
    let promise = firebase.auth().signInWithPopup(provider);

    promise
    .then( result => {
      let user = result.user;
      console.log(result);

      firebase.database().ref("users/"+user.uid).set({
        email: user.email,
        name: user.displayName
      });
      let err = "Welcome, " + user.displayName
      this.setState({err: err});
    });

    promise
    .catch(e => {
      let err = e.message;
      console.log(err);
    });
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
    };

    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
  };


  render(){
    return(
      <div>

        <p>{this.state.err}</p>

        <button onClick={this.logout} id="logoutButton" className="hide">Log Out</button>
        <br />
        <button onClick={this.google} id="google">Login With Google</button>
      </div>
    );
  }
}

export default Login;
