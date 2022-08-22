import { debounce } from 'ts-debounce'
import { useEffect, useRef, useCallback } from 'react'

export function useDebounce(cb: (arg?: any) => void, delay = 300, deps?: any[]) {
  const cbRef = useRef(cb)
  useEffect(() => {
    cbRef.current = cb
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || [])])

  return useCallback(
    debounce((...args) => cbRef.current(...args), delay),
    [delay]
  )
}
