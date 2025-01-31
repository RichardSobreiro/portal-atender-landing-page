/** @format */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'; // ✅ Added for navigation
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header({
  scrollToTesteGratis,
  scrollToPlanos,
  scrollToContato,
}: {
  scrollToTesteGratis: () => void;
  scrollToPlanos: () => void;
  scrollToContato: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // ✅ Initialize Next.js router

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  // Close the menu if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* LOGO */}
        <div className={styles.logo}>Portal Atender</div>
      </div>

      <div className={styles.navContainer}>
        {/* HAMBURGER MENU BUTTON (Mobile Only) */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <FaBars />
        </button>

        {/* NAVIGATION MENU */}
        <nav
          ref={menuRef}
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        >
          {/* Close Button (Inside the Menu) */}
          <button className={styles.closeButton} onClick={closeMenu}>
            <FaTimes />
          </button>

          <button className={styles.linkButton} onClick={scrollToTop}>
            Início
          </button>
          <button
            className={styles.linkButton}
            onClick={() => {
              scrollToTesteGratis();
              closeMenu();
            }}
          >
            Teste Grátis
          </button>
          <button
            className={styles.linkButton}
            onClick={() => {
              scrollToPlanos();
              closeMenu();
            }}
          >
            Planos
          </button>
          <button
            className={styles.linkButton}
            onClick={() => {
              scrollToContato();
              closeMenu();
            }}
          >
            Contato
          </button>

          {/* ✅ LOGIN BUTTON NOW NAVIGATES TO /entrar */}
          <button
            className={`${styles.link} ${styles.login}`}
            onClick={() => {
              closeMenu();
              router.push('/entrar'); // ✅ Navigate to the login page
            }}
          >
            Entrar
          </button>
        </nav>
      </div>
    </header>
  );
}
