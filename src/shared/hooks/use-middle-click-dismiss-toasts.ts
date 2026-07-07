import { useEffect } from 'react'
import { toast } from 'sonner'

export function useMiddleClickDismissToasts() {
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (event.button !== 1) return

      const toastEl = (event.target as HTMLElement)?.closest('[data-sonner-toast]')
      if (!toastEl) return

      event.preventDefault()
      toast.dismiss()
    }

    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
}
