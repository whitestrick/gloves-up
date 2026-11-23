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

// Small helper: is this a whole number between min and max?
function isWholeNumberBetween(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max
}

// Checks the routine form. Returns an object with one message per invalid field.
// An empty object {} means everything is valid.
export function validateRoutine({ name, rounds, roundSeconds, restSeconds, drillIds }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Give your routine a name.'
  } else if (name.trim().length > 40) {
    errors.name = 'Name must be 40 characters or less.'
  }

  // Form fields give us text, so convert to numbers before checking
  if (!isWholeNumberBetween(Number(rounds), 1, 20)) {
    errors.rounds = 'Rounds must be a whole number from 1 to 20.'
  }
  if (!isWholeNumberBetween(Number(roundSeconds), 10, 600)) {
    errors.roundSeconds = 'Round length must be 10 to 600 seconds.'
  }
  if (!isWholeNumberBetween(Number(restSeconds), 0, 300)) {
    errors.restSeconds = 'Rest must be 0 to 300 seconds.'
  }

  if (drillIds.length < 1) {
    errors.drillIds = 'Add at least one drill.'
  }

  return errors
}
