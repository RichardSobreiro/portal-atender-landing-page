import styles from './Footer.module.css';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.contactSection}>
          <h3>Contato</h3>
          <p>Em Breve</p>
          <p>Whatsapp: Em Breve</p>
          <p>contato@portalatender.com.br</p>
        </div>

        <div className={styles.socialMediaSection}>
          <h3>Redes Sociais</h3>
          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          © {currentYear} - Portal Atender - Sistema de Gestão para
          Profissionais da Área de Saúde
        </p>
      </div>
    </footer>
  );
};

export default Footer;
