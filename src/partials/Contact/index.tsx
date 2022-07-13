import style from "./index.module.css";

// Components
import Section from "components/Section";

function Contact() {
  return (
    <Section name="contact" className={style.root}>
      <header className={style.header}>
        <h2 className={style.title}>Contact</h2>
      </header>
    </Section>
  );
}
export default Contact;
