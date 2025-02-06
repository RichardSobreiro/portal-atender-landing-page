/** @format */

import React, { useState, useEffect, useRef } from 'react';
import styles from './SideMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faChartLine, // Dashboard
  faUserInjured, // Pacientes
  faCalendarAlt, // Calendário
  faStethoscope, // Atendimentos
  faBullhorn, // Marketing
  faBoxes, // Estoque
  faMoneyBillWave, // Financeiro
  faFileContract, // Vendas e Orçamentos
  faClinicMedical, // Minha Clínica
  faSignOutAlt, // Logout
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: faChartLine,
  },
  {
    label: 'Pacientes',
    link: '/pacientes',
    icon: faUserInjured,
    subItems: [{ label: 'Anamneses', link: '/pacientes/anamneses' }],
  },
  { label: 'Calendário', link: '/dashboard', icon: faCalendarAlt },
  { label: 'Atendimentos', link: '/dashboard', icon: faStethoscope },
  { label: 'Marketing', link: '/dashboard', icon: faBullhorn },
  { label: 'Estoque', link: '/dashboard', icon: faBoxes },
  { label: 'Financeiro', link: '/dashboard', icon: faMoneyBillWave },
  {
    label: 'Vendas e Orçamentos',
    link: '/dashboard',
    icon: faFileContract,
  },
  { label: 'Minha Clínica', link: '/dashboard', icon: faClinicMedical },
];

const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  const authContext = useAuth();

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideMenuRef.current &&
      !sideMenuRef.current.contains(event.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    authContext.logout();
  };

  return (
    <>
      <div
        ref={toggleButtonRef}
        className={styles.hamburger}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </div>

      <nav
        ref={sideMenuRef}
        className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}
      >
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.menuItem}>
              <Link href={item.link}>
                <div className={styles.menuLink}>
                  <span className={styles.icon}>
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </div>
              </Link>
              {item.subItems && (
                <ul className={styles.subMenu}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className={styles.subMenuItem}>
                      <Link href={subItem.link}>{subItem.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.logoutContainer} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.logoutIcon} />
          <span>Sair</span>
        </div>
      </nav>
    </>
  );
};

export default SideMenu;
