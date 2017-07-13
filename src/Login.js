import React, { Component } from 'react';
import firebase from 'firebase';
import helpers from "./utils/helpers";
// import Search from "./children/Search";
import Chat from "./children/Chat";
import Nav from "./children/Nav";
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

  setSearch(search){
    this.setState({ search: search })
  }

  searchFirebase(search){
    var self = this;
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      console.log(token);


      let searchTerm = search.trim();
      return firebase.database().ref('/users/' + searchTerm + "/village").once('value', function(snapshot) {
      console.log(snapshot.val())
        if(snapshot.val() != null){
          let villageName = "You found " + snapshot.val().title;
          self.setState({
            villageName: villageName,
            userToken: token,
            userSearch: searchTerm,
           });
          let addButton = "Sub to Village"
          self.setState({ addButton: addButton })
        }else{
          self.setState({ villageName: "Sorry, no Villages found"})
        }
      });
    })
  }

  addToken(){
    console.log(this.state.userToken)
    console.log(this.state.userSearch)
    let searchTerm = this.state.userSearch;
    let token = this.state.userToken;
    firebase.database().ref('/users/' + searchTerm + "/village/tokens").push(token);
  }

    activeCreate(){
      const create = document.getElementById("createDiv")
      const landing = document.getElementById("landingDiv")
      create.classList.remove("hide");
      landing.classList.add("hide");
    }

    homePage(){
      const create = document.getElementById("createDiv")
      const landing = document.getElementById("landingDiv")
      landing.classList.remove("hide");
      create.classList.add("hide");
    }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      successful: ' ',
      search: ' ',
      villageName: ' ',
      addButton: ' ',
      userToken: ' ',
      userSearch: ' ',
    };

    this.logout         = this.logout.bind(this);
    this.google         = this.google.bind(this);
    this.sendPush       = this.sendPush.bind(this);
    this.subToTest      = this.subToTest.bind(this);
    this.pullData       = this.pullData.bind(this);
    this.setSearch      = this.setSearch.bind(this);
    this.searchFirebase = this.searchFirebase.bind(this);
    this.addToken       = this.addToken.bind(this);
    this.homePage       = this.homePage.bind(this);
    this.activeCreate   = this.activeCreate.bind(this);
    // this.pushToMyVillage= this.pushToMyVillage.bind(this);
  };


  render(){

    return(
      <div>

        <Nav logout={this.logout} login={this.google} activeCreate={this.activeCreate} goHome={this.homePage}/>
                <Join />
        <p>{this.state.err}</p>
        <p>{this.state.userId}</p>
        <p>{this.state.successful}</p>
        <br />

        {/* <button onClick={this.pushToMyVillage}>Push To Your Village</button> */}
        <Create />
        <Chat />

        <button onClick={this.subToTest}>Sub To Test Village</button>

        <br />
        <br />

        {/* <button onClick={this.sendPush}>Push Notification</button>
        <br />
        <br />
        <button onClick={this.pullData}>Send Push to TestVillage</button>
        <br />
        <br />
        <p>{this.state.villageName}</p>
        <button onClick={this.addToken}>{this.state.addButton}</button>
        <Search setSearch={this.setSearch} searchFirebase={this.searchFirebase}/>
        <br />
        <br /> */}

      </div>
    );
  }
}

export default Login;