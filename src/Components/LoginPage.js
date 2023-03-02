import React from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import "./LoginPage.css"

export default class LoginPage extends React.Component{
  constructor(props){
    super(props)

    this.state={
      email:'',
      password:'',
      mode: 'register',
      user:null
    }
  }

  handleInput=(e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleRegister=(e)=>{
    e.preventDefault();
    
    if (this.state.email === '' || this.state.password === ''){
      alert('Please enter an email and passowrd')
    } else if(this.state.email.indexOf('@')===-1 || this.state.email.indexOf('@') === this.state.email.length-1){
      alert('Please use a valid email format')
    } else {
      createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then((userCredential) => {
      // Signed in
      console.log('success')
      console.log(userCredential)
      const user = userCredential.user;
      this.props.changeAuth(this.state.email)
      // ...
    })
    .catch((error) => {
      console.log(error.message);
      console.log(error.code)
    });
  }
}

  handleSignIn=(e)=>{
    e.preventDefault();

    if (this.state.email === '' || this.state.password === ''){
      alert('Please enter an email and passowrd')
    } else{
    signInWithEmailAndPassword(auth, this.state.email, this.state.password)
    .then((userCredential) => {
      // Signed in
      console.log('signed in!')
      console.log(userCredential)
      const user = userCredential.user;
      this.props.changeAuth(this.state.email)
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(error.code)
      if (error.code ==='auth/invalid-email'){
        alert('Invalid Email')
      } else if (error.code ==='auth/wrong-password'){
        alert('Incorrect Password')
      } else{
        alert(`Error: ${error.code}`)
      }
    });
  }
}

  registerMode=()=>{
    this.setState({
      mode: 'register',
      email:'',
      password: ''
    })
  }

  signInMode=()=>{
    this.setState({
      mode: 'signIn',
      email:'',
      password: ''
    })
  }


  render(){
    console.log(`email is ${this.state.email} and password is ${this.state.password}`)
    console.log(this.state.mode)
    return(
      <div>
        <p>hi plz login or signup</p>
        <button onClick = {this.registerMode}>Register</button><button onClick={this.signInMode}>Sign In</button>
        { this.state.mode === 'register' ?
        <form onSubmit={this.handleRegister} className="register-box">
          <p>Email: </p><input name= 'email' type='text' value = {this.state.email} onChange={this.handleInput}/>
          <p>Password: </p><input name = 'password' type='password' value = {this.state.password} onChange={this.handleInput}/>
          <input type='submit' value = 'Register!'/>
        </form> :
        <form onSubmit = {this.handleSignIn} className = "signin-box">
          <p>Email: </p><input name= 'email' type='text' value = {this.state.email} onChange={this.handleInput}/>
          <p>Password: </p><input name = 'password' type='password' value = {this.state.password} onChange={this.handleInput}/>
          <input type='submit' value = 'Sign In!'/>
        </form>}
      </div>
    )
  }
}