import React, { Component } from 'react';
import firebase from 'firebase';
import helpers from "./utils/helpers";

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

class Login extends Component {

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
          token: FBtoken
        });
        let err = "Welcome, " + user.displayName
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

  sendPush(){
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      helpers.pushToken(token)
    })
  }

  subToTest(){
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      firebase.database().ref("testvillage/").push({
        token: token
      });
    })
  }

  pullData(){
    firebase.database().ref("testvillage/").once("value", function(snapshot){
      let tokenArray = [];
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val().token;
        helpers.pushToken(item);
        console.log(item);
        tokenArray.push(item);

    })
      console.log(tokenArray)

    })
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      successful: ' ',
    };

    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.subToTest = this.subToTest.bind(this);
    this.pullData = this.pullData.bind(this);
  };


  render(){
    return(
      <div>

        <p>{this.state.err}</p>
        <p>{this.state.successful}</p>
        <button onClick={this.logout} id="logoutButton" className="hide">Log Out</button>
        <br />
        <button onClick={this.google} id="googleBtn">Login With Google</button>
        <br />
        <button onClick={this.sendPush}>Push Notification</button>
        <br />
        <button onClick={this.subToTest}>Sub To Test Village</button>
        <br />
        <button onClick={this.pullData}>Send Push to TestVillage</button>
      </div>
    );
  }
}

export default Login;
