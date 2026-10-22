import profile from '../assets/images/profile.jpg';
import Window from '../components/Window/Window';
import { paragraphs } from '../data/about';
import './About.css';
import Doodle from '../components/Doodle/Doodle';

export default function About() {
  return <section>
    <header className="page-heading"><h1>About Me</h1><Doodle kind="music" /></header>
    <div className="about-layout">
      <div className="about-intro"><Window><h2 className="handwritten">{paragraphs[0]}</h2><p>{paragraphs[1]}</p></Window></div>
      <figure className="about-photo"><img src={profile} alt="Manaswini" /></figure>
    </div>
    <div className="about-modules">{paragraphs.slice(2).map((paragraph, index) => <section className={`personal-module module-${index}`} key={paragraph}><p>{paragraph}</p></section>)}</div>
  </section>;
}
