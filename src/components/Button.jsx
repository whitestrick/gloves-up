const variants = {
  primary: 'bg-brand text-white border-brand',
  secondary: 'bg-white text-ink border-ink',
  danger: 'bg-white text-brand border-neutral-400',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`min-h-11 cursor-pointer rounded-lg border-[1.5px] px-5 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
