export function validateEmail(email) {
  if (!email.trim()) return 'Enter your email.'
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Enter a password.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return ''
}
