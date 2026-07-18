"use client";

import { motion } from "framer-motion";

export default function WarningMarquee() {
  const phrases = [
    "WARNING: HIGHLY ADDICTIVE",
    "THE PERFECT MATCH",
    "FLIRT WITH FLAVOUR",
    "MIDNIGHT CRAVINGS CURED",
    "BINGE TOGETHER",
    "CRUNCHY FEELINGS",
  ];

  const textString = "⚠️ WARNING: HIGHLY ADDICTIVE ♡ THE PERFECT MATCH ♡ FLIRT WITH FLAVOUR ♡ MIDNIGHT CRAVINGS CURED ♡ BINGE TOGETHER ♡ CRUNCHY FEELINGS ♡ ".repeat(10);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%", // Cover the whole hero section vertically
        pointerEvents: "none", // Let clicks pass through to Hero
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Path starts bottom left, goes straight right, then swoops sharply up the right edge */}
          <path
            id="curvePath"
            d="M -500,1020 L 1300,1020 C 1750,1020 1850,800 1850,-200"
          />
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Black outer border for the tape */}
        <path
          d="M -500,1020 L 1300,1020 C 1750,1020 1850,800 1850,-200"
          fill="none"
          stroke="#000000"
          strokeWidth="86"
        />

        {/* Solid Yellow Tape Background */}
        <path
          d="M -500,1020 L 1300,1020 C 1750,1020 1850,800 1850,-200"
          fill="none"
          stroke="#D4961A"
          strokeWidth="80"
          filter="url(#glow)"
        />

        {/* Scrolling Text */}
        <text
          fontSize="36"
          fontWeight="900"
          fontFamily="var(--font-body)"
          fill="#070707"
          letterSpacing="3"
        >
          <textPath
            href="#curvePath"
            startOffset="0%"
            style={{ textTransform: "uppercase" }}
          >
            {textString}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur="60s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>

        {/* Flashing overlay text (a duplicate textPath that flashes red) */}
        <text
          fontSize="36"
          fontWeight="900"
          fontFamily="var(--font-body)"
          fill="#C94040"
          letterSpacing="3"
        >
          <textPath
            href="#curvePath"
            startOffset="0%"
            style={{ textTransform: "uppercase" }}
          >
            {textString}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur="60s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}
