import React from 'react'
import './App.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LogIn from './pages/auth/LogIn'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home'
import CommunityLayout from './pages/communities/CommunityLayout'

export default function App(){
  return(
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />}/>
          <Route path="/login" exact element={<LogIn />}/>
          <Route path="/signup" exact element={<SignUp />}/>
          <Route path="/home" exact element={<Home />}/>
          <Route path='/coms' exact element={<CommunityLayout />}/>
        </Routes>
      </Router>
    </div>
  )
}
/*
    check if user exists in local storage
    if yes, redirect to dashboard
    else redirect to login
*/
const Root = () =>{
  const auth = localStorage.getItem("user");
  return auth ? <Navigate to="/communities" /> : <Navigate to="/home" />;
}