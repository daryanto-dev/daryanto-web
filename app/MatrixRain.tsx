"use client";

import { useEffect, useState } from "react";

const CHARS = "01アイウエオカキクケコサシスセソDARYANTOBOT";

type Drop = { left: number; duration: number; delay: number; chars: string };

export default function MatrixRain() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    const count = 28;
    const arr: Drop[] = Array.from({ length: count }).map(() => {
      const lineCount = 14 + Math.floor(Math.random() * 10);
      const chars = Array.from({ length: lineCount })
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join("\n");
      return {
        left: Math.random() * 100,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 6,
        chars,
      };
    });
    setDrops(arr);
  }, []);

  return (
    <div className="mx-rain" aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          style={{
            left: `${d.left}%`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        >
          {d.chars}
        </span>
      ))}
    </div>
  );
}
