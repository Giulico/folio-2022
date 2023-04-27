import { PropsWithChildren } from 'react'

import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'

import { history } from 'store'

function CustomRouter({ children, ...props }: PropsWithChildren) {
  return (
    <HistoryRouter history={history} {...props}>
      {children}
    </HistoryRouter>
  )
}

export const rootNavigate = (to: string) => {
  history.push(to)
}

export default CustomRouter
