// Types
import type { RootState } from 'store'
import type { RefObject } from 'react'

// Utils
import textFit from 'textfit'

// Hooks
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = RefObject<HTMLDivElement | HTMLDivElement[]>

function useTextFit(refs: Props) {
  const { app, sizes } = useSelector((state: RootState) => ({ app: state.app, sizes: state.sizes }))

  useEffect(() => {
    if (!refs || !app.ready) return

    const elements = (Array.isArray(refs) ? refs.map((r) => r.current) : refs.current) as
      | HTMLDivElement
      | HTMLDivElement[]

    textFit(elements, { widthOnly: true, detectMultiLine: false, maxFontSize: 400 })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.ready, sizes.width])

  return null
}

export default useTextFit
