/** @format */

import { ReactNode } from 'react';
import styles from './Layout.module.css';
import SideMenu from './SideMenu';
import { ToastContainer } from 'react-toastify';

interface Props {
  children: ReactNode;
  renderSideMenu: boolean;
}

const Layout: React.FC<Props> = ({ children, renderSideMenu }) => {
  return (
    <>
      <ToastContainer />
      <div className={styles.layout}>
        {renderSideMenu && (
          <div className={styles.sideMenuContainer}>
            <SideMenu />
          </div>
        )}
        <main className={styles.content}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
