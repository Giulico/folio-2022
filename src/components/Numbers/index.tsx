import style from './index.module.css'

// Utils
import cn from 'classnames'

// Components
import Container, { Row } from 'components/Container'

// Hooks
import { useInView } from 'react-intersection-observer'

type NumberType = {
  value: string | number
  label: string
}

type Props = {
  numbers: NumberType[]
}

function Numbers({ numbers }: Props) {
  const { ref, inView } = useInView()

  const classes = cn(style.root, {
    [style.visible]: inView
  })

  return (
    <div className={classes} ref={ref}>
      <Container grid withoutMenu>
        {numbers.map(({ value, label }, index) => (
          <Row start={index + 1} end={1} key={index} className={style.item}>
            <div className={style.wrapper}>
              <span className={style.number}>{value}</span>
            </div>
            <div className={style.wrapper}>
              <p className={style.label}>{label}</p>
            </div>
          </Row>
        ))}
      </Container>
    </div>
  )
}

export default Numbers
