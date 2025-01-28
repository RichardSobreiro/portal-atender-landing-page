/** @format */

import Header from '../components/Header/Header';
import styles from '../styles/Home.module.css';
import { FaMobileAlt, FaDesktop } from 'react-icons/fa';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Left Content */}
        <div className={styles.heroText}>
          <h1>
            O Melhor Sistema para Clínicas de Estética, Odontologia e Medicina
            em geral.
          </h1>
          <p>Veja tudo que o Portal Atender faz por você!</p>
          <button className={styles.ctaButton}>Testar Grátis</button>
        </div>

        {/* Right Icons */}
        <div className={styles.heroIcons}>
          <FaMobileAlt className={styles.icon} />
          <FaDesktop className={styles.icon} />
        </div>
      </section>
    </div>
  );
}
