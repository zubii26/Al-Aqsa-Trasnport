'use client';

import { motion } from 'framer-motion';
import { STAGE_SPRING, type ShadowTransform } from './fleetStage.styles';

export function GroundShadow({ transform, width }: { transform: ShadowTransform; width: number }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{
        x: transform.translateX,
        scale: transform.scale,
        opacity: transform.opacity,
      }}
      transition={STAGE_SPRING}
      style={{
        position: 'absolute',
        bottom: 18,
        left: '50%',
        width: width * 0.8,
        height: width * 0.18,
        marginLeft: -(width * 0.4),
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(4px)',
        pointerEvents: 'none',
      }}
    />
  );
}
