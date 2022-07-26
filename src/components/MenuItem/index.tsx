import style from './index.module.css'

import { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
  name: string
}

const MenuItem = ({ name }: Props) => {
  const dispatch = useDispatch()
  const ref = useRef(null)

  const letters = useMemo(
    () =>
      name.split('').map((letter, index) => <span key={index}>{letter}</span>),
    [name]
  )

  useEffect(() => {
    dispatch.menu.addRef(ref.current)
  }, [])

  return (
    <div className={style.root} ref={ref}>
      <div className={style.clipped}>{name}</div>
      <div className={style.outlined}>{letters}</div>
    </div>
  )
}
export default MenuItem
