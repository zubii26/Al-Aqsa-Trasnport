
'use client';

import PWAInit from '@/components/common/PWAInit';

export default function UmrahPWA() {
    return <PWAInit serviceWorkerUrl="/umrah-sw.js" scope="/" />;
}
