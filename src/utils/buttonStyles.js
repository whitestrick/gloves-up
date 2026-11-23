const variants = {
  primary: 'bg-brand text-white border-brand',
  secondary: 'bg-white text-ink border-ink',
  danger: 'bg-white text-brand border-brand',
}

// Class names shared by Button and LinkButton, so they always look identical
export function buttonClasses(variant = 'primary', className = '') {
  return `min-h-11 cursor-pointer rounded-lg border-[1.5px] px-5 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`
}
