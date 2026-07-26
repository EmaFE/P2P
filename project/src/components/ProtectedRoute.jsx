
import React from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../util/authContext"

export function ProtectedRoute({children}){
  const { user, loading } = React.useContext(Context)
  if (loading) {
    return <div>Loading...</div>
  }
  if(!user){
    return <Navigate to="/login" replace/>
  } else{
    return children
  } 
}