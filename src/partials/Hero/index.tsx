// Style
import style from "./index.module.css";

// Components
import Section from "components/Section";

export default function Hero() {
  return (
    <Section name="hero" className={style.root}>
      <header>
        <h1>
          <span className={style.titlePre}>Creative</span>
          <span className={style.titlePost}>Dev.</span>
        </h1>
      </header>
      <div className={style.middle}>
        <span className={style.line} />
        <p className={style.greetings}>Hi, I'm Giulio</p>
        <p className={style.cta}>
          Scroll down
          <br />
          to see some works
        </p>
      </div>
    </Section>
  );
}
