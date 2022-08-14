// Types
import type { RootState } from 'store'

// Utils
import { gsap } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import breakpoints from 'utils/breakpoints'
import { betweenRange } from 'utils/math'

// Hooks
import { useEffect, useRef, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

gsap.registerPlugin(ScrollToPlugin)

function useMainMenu() {
  const prevOpen = useRef<boolean>(false)
  const bounding = useRef<number[]>([])
  const dispatch = useDispatch()
  const [prevSection, setPrevSection] = useState<string>('')
  const [isScrolling, setIsScrolling] = useState<boolean>(false)

  const { app, menu, section, sizes } = useSelector((state: RootState) => ({
    app: state.app,
    menu: state.menu,
    section: state.section,
    sizes: state.sizes
  }))

  const isMediumLandscape = useMediaQuery({ minWidth: breakpoints.mdL })

  const updateSelectedItem = useCallback(() => {
    if (!menu.open) return

    let normY = window.cursor.y + 0.5
    // On mobile the height of the menu line is 80vh
    if (!isMediumLandscape) {
      normY = normY * 1.2
    }
    const min = 0
    const max = section.boundaries.length - 1
    const itemIndex = betweenRange(Math.floor(normY * menu.refs.length), min, max)

    if (itemIndex !== menu.index) {
      dispatch.menu.setIndex(itemIndex)
    }
  }, [
    menu.open,
    menu.refs.length,
    menu.index,
    isMediumLandscape,
    section.boundaries.length,
    dispatch.menu
  ])

  const resetMenuIndex = useCallback(() => {
    dispatch.menu.setIndex(-1)
  }, [dispatch.menu])

  useEffect(() => {
    // Open menu
    if (menu.open && prevOpen.current === false) {
      // Disable scroll
      disablePageScroll()

      // Save current section
      setPrevSection(section.current)

      // Highlight first item
      updateSelectedItem()

      // Animate menu items
      const scrollY = window.scrollY
      const offset = sizes.height / 8
      const height = sizes.height - offset * 2
      const snap = height / menu.refs.length
      for (let i = 0; i < menu.refs.length; i++) {
        const menuItem = menu.refs[i]
        gsap.to(menuItem, {
          y: `${snap * i - bounding.current[i] + offset + scrollY}px`,
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
          ease: 'expo.inOut'
        })
      }

      // Scroll the page
      const selectedItem = section.boundaries[menu.index]
      const selectedSection = selectedItem.name
      if (selectedSection !== prevSection) {
        gsap.to(window, {
          scrollTo: selectedItem.start,
          duration: 1.5,
          ease: 'power3.inOut',
          onStart: () => {
            setIsScrolling(true)
          },
          onComplete: () => {
            setIsScrolling(false)
          }
        })
      }

      // Reset menu index
      resetMenuIndex()
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
    // Calculate bounding when app ready and when size.height changes
    if (app.ready) {
      bounding.current = menu.refs.map((ref) => {
        const menuItemOffsetTop = ref.offsetTop
        const sectionOffsetTop = ref.parentElement?.offsetTop || 0
        return menuItemOffsetTop + sectionOffsetTop
      })
    }
  }, [app.ready, menu.refs, sizes.height])

  useEffect(() => {
    window.addEventListener('mousemove', updateSelectedItem)
    window.addEventListener('touchmove', updateSelectedItem)

    return () => {
      window.removeEventListener('mousemove', updateSelectedItem)
      window.removeEventListener('touchmove', updateSelectedItem)
    }
  }, [updateSelectedItem])

  return { isScrolling }
}

export default useMainMenu
