// Contexts
import { ModalContext } from 'components/Modal'

// Hooks
import { useContext } from 'react'

function useTransitionStage() {
  const { transitionStage } = useContext(ModalContext)
  return transitionStage
}

export default useTransitionStage
