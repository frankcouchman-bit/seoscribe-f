import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const variants = {
  primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50',
  secondary: 'bg-white/10 border border-white/20 text-white backdrop-blur-sm',
}

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  loading, 
  disabled,
  className = '',
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={`px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : children}
    </motion.button>
  )
})

Button.displayName = 'Button'
