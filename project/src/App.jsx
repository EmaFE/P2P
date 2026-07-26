import React from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LogIn from './pages/auth/LogIn'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home'
import { AuthProvider } from './util/authContext'
import Anxiety from './pages/communities/Anxiety'
import Grief from './pages/communities/Grief'
import Uni from './pages/communities/Uni'
import { Toaster } from 'sonner'
import { ProtectedRoute } from './components/ProtectedRoute'
import Account from './pages/Account'
import Admin from './pages/Admin'
import ScrollTop from './components/ScrollTop'

export default function App(){
  return(
    <div>
      <Toaster richColors position="top-center" />
      <AuthProvider>
        <Router>
          <ScrollTop/>
            <Routes>
              <Route path="/" exact element={<Home />}/>
              <Route path="/login" exact element={<LogIn />}/>
              <Route path="/signup" exact element={<SignUp />}/>
              <Route path="/community/anxiety" exact element={<ProtectedRoute><Anxiety /></ProtectedRoute>}/>
              <Route path="/community/grief" exact element={<ProtectedRoute><Grief /></ProtectedRoute>}/>
              <Route path="/community/universityStudents" exact element={<ProtectedRoute><Uni /></ProtectedRoute>}/>
              <Route path="/account" exact element={<ProtectedRoute><Account /></ProtectedRoute>}/>
              <Route path="/admin" exact element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
            </Routes>
        </Router>
      </AuthProvider>
      
    </div>
  )
}