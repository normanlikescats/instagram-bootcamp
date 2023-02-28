import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      userInput:'',
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val()}],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (e) => {
    e.preventDefault();
    
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    let currDate = new Date();
    set(newMessageRef, {
      val: this.state.userInput,
      dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString(),
    });
    this.setState({
      userInput: '',
    })
  };

  handleInput=(e)=> {
    this.setState({
      userInput: e.target.value
    })
  }

  render() {
    console.log(this.state.messages)
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val.val} - {message.val.dateTime}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Enter your message to be stored in the database!
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.writeData}>
            <input type='input' value={this.state.userInput} onChange={this.handleInput}/>
            <input type='submit' value='Submit'/>
            <ol>{messageListItems}</ol>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
