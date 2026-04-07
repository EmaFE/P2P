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
import Communities from './pages/communities/Communities'
import { AuthProvider } from './util/authContext'
import Anxiety from './pages/communities/Anxiety'
import Grief from './pages/communities/Grief'
import Uni from './pages/communities/Uni'
import { Toaster, toast } from 'sonner'

export default function App(){
  return(
    <div>
      <Toaster richColors position="top-center" />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />}/>
            <Route path="/login" exact element={<LogIn />}/>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/communities" excat element={<Communities />}/>
            <Route path="/community/anxiety" exact element={<Anxiety />}/>
            <Route path="/community/grief" exact element={<Grief />}/>
            <Route path="/community/universityStudents" exact element={<Uni />}/>
          </Routes>
        </Router>
      </AuthProvider>
      
    </div>
  )
}
/*
    check if user exists in local storage
    if yes, redirect to dashboard
    else redirect to login
*/
// const Root = () =>{
//   const auth = localStorage.getItem("user");
//   return auth ? <Navigate to="/communities" /> : <Navigate to="/home" />;
// }