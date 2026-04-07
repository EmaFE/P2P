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
import { Toaster } from 'sonner'
import { ProtectedRoute } from './components/ProtectedRoute'

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
            <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>}/>
            <Route path="/community/anxiety" exact element={<ProtectedRoute><Anxiety /></ProtectedRoute>}/>
            <Route path="/community/grief" exact element={<ProtectedRoute><Grief /></ProtectedRoute>}/>
            <Route path="/community/universityStudents" exact element={<ProtectedRoute><Uni /></ProtectedRoute>}/>
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