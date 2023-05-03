import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import "./LoginPage.css"
import { useNavigate } from 'react-router-dom';

export default function LoginPage (props){
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('register');
  const [user, setUser] = useState(null)
  console.log(user)


  function handleInput(e){
    if (e.target.name === 'email'){
      setEmail(e.target.value)
    } else if (e.target.name === 'password'){
      setPassword(e.target.value)
    }
  }

  function handleRegister(e){
    e.preventDefault();
    
    if (email === '' || password === ''){
      alert('Please enter an email and passowrd')
    } else if(email.indexOf('@')===-1 || email.indexOf('@') === email.length-1){
      alert('Please use a valid email format')
    } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in
      console.log('success')
      console.log(userCredential)
      const user = userCredential.user;
      setUser(user);
      props.changeAuth(email);
      navigate('/feed')
      // ...
    })
    .catch((error) => {
      console.log(error.message);
      console.log(error.code)
    });
  }
}

  function handleSignIn(e){
    e.preventDefault();

    if (email === '' || password === ''){
      alert('Please enter an email and passowrd')
    } else{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      console.log('signed in!')
      console.log(userCredential)
      const user = userCredential.user;
      setUser(user);
      props.changeAuth(email);
      navigate('/feed')
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

  function registerMode(){
    setEmail('');
    setPassword('');
    setMode('register')
  }

  function signInMode(){
    setEmail('');
    setPassword('');
    setMode('signin')
  }

  console.log(`email: ${email} and password: ${password}`)
  return(
      <div>
        <p>hi plz login or signup</p>
        <button onClick = {registerMode}>Register</button><button onClick={signInMode}>Sign In</button>
        { mode === 'register' ?
        <form onSubmit={handleRegister} className="register-box">
          <p>Email: </p><input name= 'email' type='text' value = {email} onChange={handleInput}/>
          <p>Password: </p><input name = 'password' type='password' value = {password} onChange={handleInput}/>
          <input type='submit' value = 'Register!'/>
        </form> :
        <form onSubmit = {handleSignIn} className = "signin-box">
          <p>Email: </p><input name= 'email' type='text' value = {email} onChange={handleInput}/>
          <p>Password: </p><input name = 'password' type='password' value = {password} onChange={handleInput}/>
          <input type='submit' value = 'Sign In!'/>
        </form>}
      </div>
  )
}