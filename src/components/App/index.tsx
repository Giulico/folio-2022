// Types
import type { RootState } from "store";

// Utils
import { cursorPosition } from "utils/events";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

// Hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Components
import ExperienceComponent from "components/Experience";
import LoadProgress from "components/LoadProgress";
import Hero from "partials/Hero";
import Portfolio from "partials/Portfolio";
import About from "partials/About";
import Contact from "partials/Contact";

window.cursor = {
  x: 0,
  y: 0,
};

function App() {
  const dispatch = useDispatch();
  const { app, scroll, sizes } = useSelector((state: RootState) => ({
    app: state.app,
    scroll: state.scroll,
    sizes: state.sizes,
  }));

  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };
    appHeight();

    window.addEventListener("resize", (event) => {
      dispatch.sizes.update({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      appHeight();
    });

    const savePointerPosition = (e: TouchEvent | MouseEvent) => {
      const { x, y } = cursorPosition(e);
      window.cursor.x = x / sizes.width - 0.5;
      window.cursor.y = y / sizes.height - 0.5;
    };

    window.addEventListener("touchstart", savePointerPosition);
    window.addEventListener("touchmove", savePointerPosition);
    window.addEventListener("mousemove", savePointerPosition);
  }, []);

  useEffect(() => {
    if (scroll) {
      enablePageScroll();
    } else {
      disablePageScroll();
    }
  }, [scroll]);

  return (
    <>
      <ExperienceComponent />
      <Hero />
      <Portfolio />
      <About />
      <Contact />
      <LoadProgress />
    </>
  );
}

export default App;
