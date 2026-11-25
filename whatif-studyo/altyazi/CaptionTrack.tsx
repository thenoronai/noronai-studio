// Kelime altyazısı (TARZ-REHBERI.md Kural seti 2A): Montserrat Black, beyaz dolgu, siyah kenar,
// tek satır, karenin üstten %70'inde sabit, animasyonsuz. Gruplar araclar/altyazi.py ile hazırlanır
// (en çok 2 kelime / 12 karakter, noktalamada yeni grup, zamanlar kelime zaman damgalarından).
// olcek: 1080 genişlik için 1, 2160 (4K) için 2. Konuşma olmayan anda hiçbir şey çizmez.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';

const {fontFamily} = loadFont('normal', {weights: ['900'], subsets: ['latin']});

export type Chunk = {text: string; startMs: number; endMs: number};

export const CaptionTrack: React.FC<{chunks: Chunk[]; olcek?: number}> = ({chunks, olcek = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const active = chunks.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!active) return null;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          fontFamily,
          fontWeight: 900,
          fontSize: 70 * olcek,
          color: '#FFFFFF',
          // paintOrder ile kenar dolgunun arkasında kalır: görünen kenar 7 px için çizgi 14 px
          WebkitTextStroke: `${14 * olcek}px #000000`,
          paintOrder: 'stroke fill',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
