import React, { Component } from 'react';
import firebase from 'firebase';


class TestChat extends Component {


  writeChat() {
      var self = this;
      const user = firebase.auth().currentUser;

      var messageData = {
        chat: this.state.chat,
        username: user.displayName,
      };

      // Get a key for a new Post.
      let newMessageKey = firebase.database().ref("testvillage").child("message").push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      let updates = {};
      updates['/messages/' + newMessageKey] = messageData;

      return firebase.database().ref("testvillage/").update(updates).then(function(){
        self.setState({ chat: " " })
        console.log(self.state.chat)
      })


    }

    chatChange(event){
      this.setState({ chat: event.target.value })
      // console.log(this.state.chat)
    }

    updateScroll(){
      var element = document.getElementById("messageBox");
      element.scrollTop = element.scrollHeight;
    }

    scrollToBottom = () => {
       const messagesContainer = document.getElementById("messageBox")
       messagesContainer.scrollTop = messagesContainer.scrollHeight;
   };

   componentDidMount() {
      this.scrollToBottom();
  }

  componentDidUpdate() {
      this.scrollToBottom();
  }

  loopInTest(event){
    let selectMessages = []
    let self = this
    console.log('loopInTest', event.target.value)
    let chatKey = event.target.value
    firebase.database().ref("chats/"+chatKey+"/messages").on("value", (snapshot)=>{
      console.log(snapshot.val())
      snapshot.forEach(function(childSnapshot) {
      console.log(childSnapshot.val())
      selectMessages.push(childSnapshot.val())
      })
      self.setState({
        selectedChat: selectMessages,
        chatKey: chatKey
      });
      console.log(self.state.selectedChat)

    })

  }
  writeChatTwo() {
      var self = this;
      self.setState({selectedChat: []})
      const user = firebase.auth().currentUser;
      let chatKey = this.state.chatKey
      var messageData = {
        chat: this.state.chat,
        username: user.displayName,
      };

      // Get a key for a new Post.
      let newMessageKey = firebase.database().ref("chats/"+chatKey).child("messages").push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      let updates = {};
      updates['/messages/' + newMessageKey] = messageData;

      return firebase.database().ref("chats/"+chatKey).update(updates).then(function(){
        self.setState({ chat: " " })
        console.log(self.state.chat)
      })


    }


  constructor(props){
    super(props);

    this.state = {
      chat: ' ',
      messages: [],
    };
    firebase.database().ref('testvillage/messages').on('value', function(snapshot){
       let self = this
       let messages = [ ]
        if(snapshot.val() != null){
          snapshot.forEach(function(childSnapshot) {
          console.log(childSnapshot.val())
          messages.push(childSnapshot.val())
          })
          self.setState({messages: messages})
          console.log(self.state.messages)
        }else{
          console.log('no messages yet')
        }

      }.bind(this));


    this.writeChat = this.writeChat.bind(this);
    this.writeChatTwo = this.writeChatTwo.bind(this);
    this.chatChange = this.chatChange.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.loopInTest = this.loopInTest.bind(this);
  }

  render(){

    return(
      <div className="messageCom hide" id="testChatDiv">

        <div className="messagesList scroll" id="messageBox" >
               {this.state.messages.map(function(each){
                      return <div>

                        <p>{each.username}: <br />{each.chat}</p>
                    </div>;
               })}
         </div>

          <input value={this.state.chat} onChange={this.chatChange} className="inputBar"></input>

          <br />
          <button onClick={this.writeChat} className="waves-effect waves-light btn #fbc02d yellow darken-2">Message</button>
      </div>
    );
  }
}

export default TestChat;