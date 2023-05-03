import React from "react";
import { useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import ErrorPage from "./ErrorPage";
import MainAppPage from "./MainAppPage";
import LoginPage from "./LoginPage";

function App (){
  const [userAuth, setUserAuth] = useState(false);
  const [email, setEmail ] = useState(''); 

  function handleAuth(email){
    setEmail(email);
    setUserAuth(!userAuth);
  }
  
  return (
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Routes>
              <Route path="/" element= {<LoginPage changeAuth = {handleAuth}/>}/>
              <Route path="/login" element= {<LoginPage changeAuth = {handleAuth}/>}/>
              <Route path="/feed" element= {<MainAppPage email = {email} changeAuth = {handleAuth}/>}/>
              <Route path="*" element= {<ErrorPage/>}/>
            </Routes>            
          </BrowserRouter>
        </header>
      </div>
    );
}
export default App;


          /*{ userAuth
          ? <MainAppPage email = {email} changeAuth = {handleAuth}/>
          : <LoginPage changeAuth = {handleAuth}/>}*/