import type { ReactElement } from 'react'

// Style
import style from './index.module.css'

// Hooks
import { useDispatch } from 'react-redux'
import { useEffect, useCallback } from 'react'

type Props = {
  children?: ReactElement
  name: string
  sizes?: [number, number]
}

function ImageTrigger({ children, name, sizes = [3, 2] }: Props) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch.images.addImage({
      name,
      sizes
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch.images, name, sizes[0], sizes[1]])

  const showImage = useCallback(() => {
    dispatch.pointer.setType('image')
    dispatch.images.showImage(name)
  }, [dispatch.images, name])

  const hideImage = useCallback(() => {
    dispatch.pointer.setType('default')
    dispatch.images.hideImage(name)
  }, [dispatch.images, name])

  return (
    <em className={style.root} onMouseEnter={showImage} onMouseLeave={hideImage}>
      {children}
    </em>
  )
}
export default ImageTrigger
