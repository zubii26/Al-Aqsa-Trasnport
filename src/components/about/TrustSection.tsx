'use client';

import styles from './TrustSection.module.css';

export default function TrustSection() {

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.card}>
                    <div className={styles.glow}></div>
                    <blockquote className={styles.quote}>
                        &quot;Trust is the foundation of our service. We are honored to be the choice of thousands of pilgrims.&quot;
                    </blockquote>
                    <cite className={styles.source}>- CEO, Al Aqsa Umrah Transport</cite>
                </div>
            </div>
        </section>
    );
}
