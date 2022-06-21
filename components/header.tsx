import Image from 'next/image';

import logoImage from '../assets/common/market-logo.png';
import styles from '../styles/components/Header.module.scss';

export default function Header() {

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Image src={logoImage}/>
            </div>
        </div>
    );
};