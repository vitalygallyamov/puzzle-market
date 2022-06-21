import Header from './header';
import type { ReactElement } from 'react';

import styles from '../styles/Layout.module.scss';

export default function Layout({ children }: { children: ReactElement }) {
    return (
      <>
        <Header />
        <div className={styles.container}>
            <div className={styles.wrapper}>{children}</div>
        </div>
      </>
    )
  }