import { cursorPosition } from "utils/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import type { RootState } from "store";

import ExperienceComponent from "components/Experience";
import Hero from "partials/Hero";
import Portfolio from "partials/Portfolio";
import About from "partials/About";

window.cursor = {
  x: 0,
  y: 0,
};

function App() {
  const dispatch = useDispatch();
  const sizes = useSelector((state: RootState) => state.sizes);

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

  return (
    <>
      <ExperienceComponent />
      <Hero />
      <Portfolio />
      <About />
    </>
  );
}

export default App;
