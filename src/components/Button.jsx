import { buttonClasses } from '../utils/buttonStyles'

// A normal <button>. Use it for actions (save, delete, log out).
export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={buttonClasses(variant, className)} {...props} />
}
