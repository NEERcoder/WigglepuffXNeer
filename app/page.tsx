'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { LandingScreen } from '@/components/landing-screen'
import { MusicPlayer } from '@/components/music-player'
import { MusicProvider } from '@/components/music-provider'
import { SpaceBackground } from '@/components/space-background'
import { UniverseScreen } from '@/components/universe-screen'

export default function Page() {
  const [unlocked, setUnlocked] = useState(false)

  return (
    <MusicProvider>
      <main className="relative min-h-dvh overflow-x-hidden">
        <SpaceBackground dense={unlocked} />

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <LandingScreen onUnlock={() => setUnlocked(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="universe"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <UniverseScreen />
            </motion.div>
          )}
        </AnimatePresence>

        <MusicPlayer />
      </main>
    </MusicProvider>
  )
}
