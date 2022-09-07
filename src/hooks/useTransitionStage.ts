// Contexts
import { ModalContext } from 'components/Modal'

// Hooks
import { useContext, useState, useEffect } from 'react'

function useTransitionStage() {
  const [ts, setTs] = useState<'open' | 'close'>()
  const { transitionStage } = useContext(ModalContext)

  useEffect(() => {
    requestAnimationFrame(() => {
      setTs(transitionStage)
    })
  }, [transitionStage])

  return ts
}

export default useTransitionStage
