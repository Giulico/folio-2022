import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import type { RootState } from "store";

import ExperienceComponent from "components/Experience";
import Section from "components/Section";

window.cursor = {
  x: 0,
  y: 0,
};

function App() {
  const dispatch = useDispatch();
  const sizes = useSelector((state: RootState) => state.sizes);

  useEffect(() => {
    window.addEventListener("resize", (event) => {
      dispatch.sizes.update({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    window.addEventListener("mousemove", (event) => {
      window.cursor.x = event.clientX / sizes.width - 0.5;
      window.cursor.y = event.clientY / sizes.width - 0.5;
    });
  }, []);

  return (
    <>
      <ExperienceComponent />
      <div className="container">
        <Section>Titolo</Section>
        <Section>About</Section>
        <Section>Portfolio</Section>
      </div>
    </>
  );
}

export default App;
