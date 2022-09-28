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
  const dispatch = useDispatch()
  const [prevSection, setPrevSection] = useState<string>('')
  const [isScrolling, setIsScrolling] = useState<boolean>(false)

  const { menu, section, sizes } = useSelector((state: RootState) => ({
    menu: state.menu,
    section: state.section,
    sizes: state.sizes
  }))

  const isMediumLandscape = useMediaQuery({ minWidth: breakpoints.mdL })

  const updateSelectedItem = useCallback(() => {
    if (!menu.open) return

    let normY = window.cursorNormalized.y + 0.5
    // On mobile the height of the menu line is 80vh
    if (!isMediumLandscape) {
      normY = normY * 1.2
    }
    const length = section.boundaries.length
    const min = 0
    const max = length - 1
    const itemIndex = betweenRange(Math.floor(normY * length), min, max)

    if (itemIndex !== menu.index) {
      dispatch.menu.setIndex(itemIndex)
    }
  }, [menu.open, menu.index, isMediumLandscape, section.boundaries.length, dispatch.menu])

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
      const titles = window.experience.world.titles
      for (let i = 0; i < titles.length; i++) {
        const title = titles[i]
        title.menuOpen(i)
      }
    }

    // Close menu
    if (!menu.open && prevOpen.current === true) {
      // Enable scroll
      enablePageScroll()

      // Scroll the page
      const selectedItem = section.boundaries[menu.index]
      const selectedSection = selectedItem.name
      if (selectedSection !== prevSection) {
        window.scrollTo(0, selectedItem.start)
        // gsap.to(window, {
        //   scrollTo: selectedItem.start,
        //   duration: 1.5,
        //   ease: 'power3.out',
        //   onStart: () => {
        //     setIsScrolling(true)
        //   },
        //   onComplete: () => {
        //     setIsScrolling(false)
        //   }
        // })
      }

      // Restore menu items
      const titles = window.experience.world.titles
      for (let i = 0; i < titles.length; i++) {
        const title = titles[i]
        title.menuClose()
      }

      // Reset menu index
      resetMenuIndex()
    }

    prevOpen.current = menu.open
  }, [
    menu.index,
    menu.open,
    prevSection,
    resetMenuIndex,
    section,
    sizes.height,
    updateSelectedItem
  ])

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
