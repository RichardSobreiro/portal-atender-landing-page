/** @format */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
      <div className={styles.headerContainer}>
        {/* LOGO */}
        <div className={styles.logo}>Portal Atender</div>

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
          <Link
            href="#teste-gratis"
            className={styles.link}
            onClick={closeMenu}
          >
            Teste Grátis
          </Link>
          <Link href="#precos" className={styles.link} onClick={closeMenu}>
            Preços
          </Link>
          <Link href="#contato" className={styles.link} onClick={closeMenu}>
            Contato
          </Link>
          <Link href="#videos" className={styles.link} onClick={closeMenu}>
            Vídeos
          </Link>
          <Link
            href="#login"
            className={`${styles.link} ${styles.login}`}
            onClick={closeMenu}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
