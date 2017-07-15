import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import firebase from 'firebase';
import LogoTran from './images//villagetwo.png'
import HelpLogo from './images/helpMe.png'
import Chat from "./children/Chat";
import Create from "./children/Create"
import Join from "./children/Join"
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCDa28-IY2mrgw0SvUJ8AfqCs1Ca8BfWFY",
  authDomain: "villageherald-e65.firebaseapp.com",
  databaseURL: "https://villageherald-e65.firebaseio.com",
  projectId: "villageherald-e65",
  storageBucket: "villageherald-e65.appspot.com",
  messagingSenderId: "980213325202"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onMessage(function(payload) {
  console.log("On Message: ", payload);
});


class App extends Component {

  componentWillMount(){
    firebase.auth().onAuthStateChanged(function(auth) {

        const user = firebase.auth().currentUser;

        //User authenticated and active session begins.
        if (auth != null) {
          console.log('User authenticated: ' + user.displayName);
          console.log(user);
          var googleBtn = document.getElementById('googleBtn');
          googleBtn.classList.add('hide');
          let lout = document.getElementById("logoutButton");
          lout.classList.remove("hide")
          let err = "Welcome, " + user.displayName;
          let successful = "You are successfully logged in with Google."
          this.setState({
            err: err,
            successful: successful,
            showChat: true,
          });
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
    var googleBtn = document.getElementById('googleBtn');
    googleBtn.classList.remove('hide');
    let err = "Thanks!";
    let successful = "You have successfully logged out."
    this.setState({
      err: err,
      successful: successful,
      showChat: false,
    });
  }

  google(){
    console.log("this is google method")

    let provider = new firebase.auth.GoogleAuthProvider();
    let promise = firebase.auth().signInWithPopup(provider);
    messaging.requestPermission()
    .then(function() {
      console.log("Have permission");
      return messaging.getToken();
    })
    .then(function(token) {
      console.log("We have a token: " + token);
      let FBtoken = token
      promise
      .then( result => {
        let user = result.user;
        console.log(result);

        firebase.database().ref("users/"+user.uid).set({
          email: user.email,
          name: user.displayName,
          token: FBtoken,
          village: {
            title: user.displayName + "'s Village",
            tokens: FBtoken,
          },
        });
        let err = "Welcome, " + user.displayName ;
        this.setState({err: err});
    })
    .catch(function(err) {
      console.log('Error occurred in push', err);
    })


    });

    promise
    .catch(e => {
      let err = e.message;
      console.log(err);
    });
  }

  activeCreate(){
    const create = document.getElementById("createDiv")
    const landing = document.getElementById("landingDiv")
    const join = document.getElementById("joinDiv")
    const chat = document.getElementById("chatDiv")
    chat.classList.add("hide");
    join.classList.add("hide");
    create.classList.remove("hide");
    landing.classList.add("hide");
  }
  activeJoin(){
    const create = document.getElementById("createDiv")
    const landing = document.getElementById("landingDiv")
    const join = document.getElementById("joinDiv")
    const chat = document.getElementById("chatDiv")
    chat.classList.add("hide");
    create.classList.add("hide");
    landing.classList.add("hide");
    join.classList.remove("hide");
    console.log('clicked activeJoin')
  }

  homePage(){
    const create = document.getElementById("createDiv")
    const landing = document.getElementById("landingDiv")
    const join = document.getElementById("joinDiv")
    const chat = document.getElementById("chatDiv")
    chat.classList.add("hide");
    join.classList.add("hide");
    landing.classList.remove("hide");
    create.classList.add("hide");
  }
  activeChat(){
    const create = document.getElementById("createDiv")
    const landing = document.getElementById("landingDiv")
    const join = document.getElementById("joinDiv")
    const chat = document.getElementById("chatDiv")
    chat.classList.remove("hide");
    join.classList.add("hide");
    landing.classList.add("hide");
    create.classList.add("hide");
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      successful: ' ',
      search: ' ',
      villageName: ' ',
      userToken: ' ',
      userSearch: ' ',
    }

    this.logout         = this.logout.bind(this);
    this.google         = this.google.bind(this);
    this.homePage       = this.homePage.bind(this);
    this.activeCreate   = this.activeCreate.bind(this);
    this.activeJoin   = this.activeJoin.bind(this);
    // this.pushToMyVillage= this.pushToMyVillage.bind(this);
  };

  render() {
    return (
      <div className="App">

        <nav>
          <div className="nav-wrapper #80deea cyan lighten-3">
            <a href="index.html" className="brand-logo center" onClick={this.goHome}><img src={LogoTran} className="navLogo" alt="logo" /></a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a onClick={this.activeCreate}>Create Village</a></li>
              <li><a onClick={this.activeJoin}>Join Village</a></li>
              <li><a onClick={this.activeChat}>Chat</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a>{this.state.err}</a></li>

              <li><a onClick={this.logout} className="hide" id="logoutButton">Logout</a></li>
              <li><a onClick={this.google} id="googleBtn">Login</a></li>
            </ul>
          </div>
        </nav>
        <br />
        <div id="landingDiv">
          <h4 className="logoFont">Make One, Join One, Takes One.</h4>
          <img src={HelpLogo} alt="helplogo" id="helpLogo"/>
        </div>

        <Login />
        <Create />
        <Join />
        <Chat />
      </div>
    );
  }
}

export default App;
