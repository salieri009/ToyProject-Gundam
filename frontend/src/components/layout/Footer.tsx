import React from 'react'

export function Footer() {
  return (
    <footer className="mt-16 border border-crt-glow/20 bg-black/30 p-4 rounded text-center relative font-mono text-xs">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-crt-glow/30 to-transparent"></div>
      <div className="space-y-2 text-crt-text/60">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <span>TACTICAL MS: RX-78-2 GUNDAM v2.0</span>
          <span>|</span>
          <span>MAIN LINK: ESTABLISHED</span>
          <span>|</span>
          <span>COMMUNICATION: ENCRYPTED (AES-256)</span>
        </div>
        <div className="text-[10px] text-crt-text/40 pt-1">
          (C) U.C.0079 ANAHEIM ELECTRONICS - ALL TACTICAL NETWORKS DEPLOYED
        </div>
      </div>
    </footer>
  )
}