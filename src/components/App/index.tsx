import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import type { RootState } from "store";

import ExperienceComponent from "components/Experience";
import Hero from "partials/Hero";

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

    window.addEventListener("mousemove", (event) => {
      window.cursor.x = event.clientX / sizes.width - 0.5;
      window.cursor.y = event.clientY / sizes.width - 0.5;
    });
  }, []);

  return (
    <>
      <ExperienceComponent />
      <Hero />
    </>
  );
}

export default App;
