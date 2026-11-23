import { Link } from 'react-router-dom'
import { buttonClasses } from '../utils/buttonStyles'

// A <Link> that looks like a Button. Use it for navigation (go to another page).
// The extra classes centre the text, because a link is not a button by default.
export default function LinkButton({ variant = 'primary', className = '', ...props }) {
  return (
    <Link
      className={buttonClasses(variant, `inline-flex items-center justify-center ${className}`)}
      {...props}
    />
  )
}
