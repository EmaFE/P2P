
export const validateEmail = (email) =>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const checkPassword = (password, confirmPassword) =>{
  return password === confirmPassword
}