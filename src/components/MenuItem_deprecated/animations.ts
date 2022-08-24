import { gsap } from 'gsap'

export const leaveTop = (element: HTMLDivElement): void => {
  gsap.fromTo(
    element,
    {
      clipPath: 'ellipse(100% 60% at 50% 50%)'
    },
    {
      clipPath: 'ellipse(100% 30% at 50% -50%)',
      duration: 0.5,
      ease: 'power3.out'
    }
  )
}

export const leaveBottom = (element: HTMLDivElement): void => {
  gsap.fromTo(
    element,
    {
      clipPath: 'ellipse(100% 60% at 50% 50%)'
    },
    {
      clipPath: 'ellipse(100% 30% at 50% 150%)',
      duration: 0.5,
      ease: 'power3.out'
    }
  )
}

export const enterTop = (element: HTMLDivElement): void => {
  gsap.fromTo(
    element,
    {
      clipPath: 'ellipse(100% 50% at 50% -50%)'
    },
    {
      clipPath: 'ellipse(100% 60% at 50% 50%)',
      duration: 0.5,
      ease: 'power3.out'
    }
  )
}

export const enterBottom = (element: HTMLDivElement): void => {
  gsap.fromTo(
    element,
    {
      clipPath: 'ellipse(100% 30% at 50% 150%)'
    },
    {
      clipPath: 'ellipse(100% 60% at 50% 50%)',
      duration: 0.5,
      ease: 'power3.out'
    }
  )
}
