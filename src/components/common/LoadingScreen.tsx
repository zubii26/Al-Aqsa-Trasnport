import Image from 'next/image';
import styles from './Preloader.module.css';

export default function LoadingScreen() {
    return (
        <div className={styles.preloader}>
            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <div className={styles.ring}></div>
                    <div className={styles.logo}>
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa Transport"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
                <div className={styles.text}>Al Aqsa Transport</div>
            </div>
        </div>
    );
}
