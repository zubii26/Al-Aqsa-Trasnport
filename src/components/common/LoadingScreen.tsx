import Image from 'next/image';
import styles from './Preloader.module.css';

export default function LoadingScreen() {
    return (
        <div className={styles.preloader}>
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`
                    }} />
                ))}
            </div>
            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <div className={styles.ringOuter}></div>
                    <div className={styles.ringInner}></div>
                    <div className={styles.glowEffect}></div>
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
                <div className={styles.textWrapper}>
                    <div className={styles.text}>Al Aqsa Transport</div>
                    <div className={styles.subtext}>Premium Journey</div>
                </div>
            </div>
        </div>
    );
}
