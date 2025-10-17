import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if cmd/ctrl is pressed
      const modifier = e.metaKey || e.ctrlKey

      Object.entries(shortcuts).forEach(([key, callback]) => {
        const [modifierKey, mainKey] = key.split('+')
        
        if (modifierKey === 'cmd' && modifier && e.key.toLowerCase() === mainKey.toLowerCase()) {
          e.preventDefault()
          callback(e)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
