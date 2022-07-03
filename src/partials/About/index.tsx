import style from "./index.module.css";

// Components
import Section from "components/Section";

function About() {
  return (
    <Section name="about" className={style.root}>
      <header className={style.header}>
        <h2 className={style.title}>About</h2>
      </header>
    </Section>
  );
}
export default About;
