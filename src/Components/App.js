import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, database } from "../firebase";
import "./App.css";
import MainAppPage from "./MainAppPage";
import LoginPage from "./LoginPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userAuth: false,
      email: '',
    };
  }

  handleAuth =(email)=>{
    this.setState({
      userAuth: !this.state.userAuth,
      email: email
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.userAuth
          ? <MainAppPage email = {this.state.email} changeAuth = {this.handleAuth}/>
          : <LoginPage changeAuth = {this.handleAuth}/>}
        </header>
      </div>
    );
  }
}
export default App;
