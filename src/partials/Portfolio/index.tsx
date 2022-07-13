// Types
import { RootState } from "store";

// Style
import style from "./index.module.css";

// Hooks
import { useRef } from "react";
import { useSelector } from "react-redux";

// Components
import Section from "components/Section";
import { useEffect } from "react";

function Portfolio() {
  const isActive = useRef<boolean>(false);
  const elementYPosition = useRef<number>();

  const { current: currentSection } = useSelector(
    (state: RootState) => state.section
  );

  const saveElementPosition = (
    boundary: RootState["section"]["boundaries"][0]
  ) => {
    const world = window.experience.world;

    elementYPosition.current = boundary.start;

    if (world.portfolio) {
      world.portfolio.initialScrollPosition = elementYPosition.current;
    }
  };

  useEffect(() => {
    const world = window.experience.world;

    if (currentSection === "portfolio") {
      isActive.current = true;

      // Entering
      if (!world.portfolio) return;
      world.portfolio.enterAnimation().then(() => {
        if (!world.portfolio) return;
        world.portfolio.isVisible = true;
      });
    } else if (isActive.current) {
      isActive.current = false;

      // Leaving
      if (!world.portfolio) return;
      world.portfolio.isVisible = false;
      world.portfolio.leaveAnimation();
    }
  }, [currentSection]);

  return (
    <Section
      name="portfolio"
      className={style.root}
      onEnter={saveElementPosition}
    >
      <header className={style.header}>
        <h2 className={style.title}>Portfolio</h2>
      </header>
    </Section>
  );
}
export default Portfolio;
