// Types
import type { RootState } from "store";

// Utils
import { useSelector } from "react-redux";

// Hooks
import { useEffect, useRef } from "react";

// Components
import Experience from "./Experience";

function ExperienceComponent() {
  const { current: currentSection } = useSelector(
    (state: RootState) => state.section
  );
  const experience = useRef<Experience>();

  useEffect(() => {
    const canvas: HTMLCanvasElement | null =
      document.querySelector("canvas.webgl");
    if (!canvas) throw new Error("Failed to find the canvas element");

    experience.current = new Experience({
      targetElement: canvas,
    });
  }, []);

  useEffect(() => {
    if (experience.current) {
      switch (currentSection) {
        case "about":
          experience.current.world.man?.animation?.play?.("action01");
          break;
        case "portfolio":
          experience.current.world.man?.animation?.play?.("action02");
          break;
        default:
          break;
      }
    }
  }, [currentSection]);

  return <canvas className="webgl" />;
}

export default ExperienceComponent;
