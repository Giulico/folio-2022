// Types
import type { RootState } from 'store'

// Utils
import { gsap } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

// Hooks
import { useEffect, useRef, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

gsap.registerPlugin(ScrollToPlugin)

function useMainMenu() {
  const prevOpen = useRef<boolean>(false)
  const dispatch = useDispatch()
  const [prevSection, setPrevSection] = useState<string>('')

  const { menu, section, sizes } = useSelector((state: RootState) => ({
    menu: state.menu,
    section: state.section,
    sizes: state.sizes
  }))

  const updateSelectedItem = useCallback(() => {
    if (!menu.open) return

    const normY = window.cursor.y + 0.5
    const itemIndex = Math.floor(normY * menu.refs.length)

    if (itemIndex !== menu.index) {
      dispatch.menu.setIndex(itemIndex)
    }
  }, [menu.open, menu.refs.length, menu.index, dispatch.menu])

  const resetMenuIndex = useCallback(() => {
    dispatch.menu.setIndex(-1)
  }, [dispatch.menu])

  useEffect(() => {
    // Open menu
    if (menu.open && prevOpen.current === false) {
      // Save current section
      setPrevSection(section.current)

      // Disable scroll
      disablePageScroll()

      // Highlight first item
      updateSelectedItem()

      // Animate menu items
      const bounding = menu.refs.map((e) => e.getBoundingClientRect().top)
      const snap = sizes.height / menu.refs.length
      for (let i = 0; i < menu.refs.length; i++) {
        const menuItem = menu.refs[i]
        gsap.to(menuItem, {
          y: `${snap * i - bounding[i]}px`,
          duration: 1,
          ease: 'power3.out'
        })
      }
    }

    // Close menu
    if (!menu.open && prevOpen.current === true) {
      // Enable scroll
      enablePageScroll()

      // Restore menu items
      for (let i = 0; i < menu.refs.length; i++) {
        const menuItem = menu.refs[i]
        gsap.to(menuItem, {
          y: `0px`,
          onComplete: () => {
            gsap.set(menuItem, { clearProps: 'all' })
          },
          duration: 1,
          ease: 'power3.out'
        })
      }

      // Scroll the page
      // TODO scroll imediately

      gsap.delayedCall(1, () => {
        if (section.current !== prevSection) {
          gsap.to(window, {
            scrollTo: menu.refs[menu.index],
            duration: 1.5,
            ease: 'power3.inOut'
          })
        }
        // Reset menu index
        resetMenuIndex()
      })
    }

    prevOpen.current = menu.open
  }, [
    menu.index,
    menu.open,
    menu.refs,
    prevSection,
    resetMenuIndex,
    section,
    sizes.height,
    updateSelectedItem
  ])

  useEffect(() => {
    window.addEventListener('mousemove', updateSelectedItem)

    return () => {
      window.removeEventListener('mousemove', updateSelectedItem)
    }
  }, [updateSelectedItem])

  return {}
}

export default useMainMenu
