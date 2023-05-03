import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onChildAdded, push, ref, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth" 
import { storage, database, auth } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";

export default function MainAppPage (props){
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [fileInputValue, setFileInputValue] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [reloader, setReloader] = useState(0);
  
  useEffect(()=> {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // For Text Input
    onChildAdded(messagesRef, (data) => {
      console.log('data: '+data.val)
      console.log(messages)
      setMessages((prev)=> [...prev, {key: data.key, val: data.val()}])
    })
  },[])



  function imageSubmit(e){
    e.preventDefault();
    
    // for image
    const imageListRef = storageRef(storage, DB_IMAGES_KEY + "/" + fileInputValue);
    uploadBytes(imageListRef, fileUpload).then((snapshot)=>{
      console.log('uploaded')
      console.log(snapshot['ref']['fullPath'])
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        writeData(url)
        setFileInputValue('');
        setFileUpload(null)
        setReloader((prev)=>prev+1)
      })
    })    
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  function writeData(url){
    //for text
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    let currDate = new Date();
    set(newMessageRef, {
      val: textInput,
      dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString(),
      url: url
    });
    setTextInput('');
  };

  function handleInput(e){
    setTextInput(e.target.value)
  }

  function handleFile(e){
    setFileInputValue(e.target.files[0].name)
    setFileUpload(e.target.files[0])
  }

  function handleSignOut(){
    signOut(auth).then(() => {
      console.log('signed out')
      navigate('/login');
      props.changeAuth('');
    })
  }

  let messageListItems = messages.map((message) => (
    <div>{message.val.val}<br/>
    <img className='post-image' src = {message.val.url} alt=''/><br/>
    {message.val.dateTime}</div>
  ));
  
  return (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <p>
            Hi, {props.email}. Enter your message to be stored in the database or upload an image!
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={imageSubmit}>
            <input type='input' value={textInput} onChange={handleInput}/>
            <input type='file' onChange={handleFile}/>
            <br/>
            <input type='submit' value='Submit'/>
            <div>{messageListItems}</div>
          </form>
      </div>
    );
}




/*class MainAppPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput:'',
      messages: [],
      fileInputValue: '',
      fileUpload: null,
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // For Text Input
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val()}],
      }));
    });
  }

  imageSubmit=(e)=>{
    e.preventDefault();
    
    // for image
    const imageListRef = storageRef(storage, DB_IMAGES_KEY + "/" + this.state.fileInputValue);
    uploadBytes(imageListRef, this.state.fileUpload).then((snapshot)=>{
      console.log('uploaded')
      console.log(snapshot['ref']['fullPath'])
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        this.writeData(url)
        this.setState({
          fileInputValue: '',
          fileUpload: null,
        })
      })
    })    
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    //for text
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    let currDate = new Date();
    set(newMessageRef, {
      val: this.state.textInput,
      dateTime: currDate.toLocaleDateString() + " " + currDate.toLocaleTimeString(),
      url: url
    });
    this.setState({
      textInput: '',
    })
  };

  handleInput=(e)=> {
    this.setState({
      textInput: e.target.value
    })
  }

  handleFile=(e)=>{
    this.setState({
      fileUpload: e.target.files[0],
      fileInputValue: e.target.files[0].name
    })
  }

  handleSignOut=()=>{
    signOut(auth).then(() => {
      console.log('signed out')
      this.props.changeAuth('');
    })
  }

  render() {
    console.log(this.state.fileInputValue)
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div>{message.val.val}<br/>
      <img className='post-image' src = {message.val.url} alt=''/><br/>
      {message.val.dateTime}</div>
    ));
    return (
        <div>
          <button onClick={this.handleSignOut}>Sign Out</button>
          <p>
            Hi, {this.props.email}. Enter your message to be stored in the database or upload an image!
          </p>
          <form onSubmit={this.imageSubmit}>
            <input type='input' value={this.state.textInput} onChange={this.handleInput}/>
            <input type='file' onChange={this.handleFile}/>
            <br/>
            <input type='submit' value='Submit'/>
            <div>{messageListItems}</div>
          </form>
      </div>
    );
  }
}

export default MainAppPage;*/
