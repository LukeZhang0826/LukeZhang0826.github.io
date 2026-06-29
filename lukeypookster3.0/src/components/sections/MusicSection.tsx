import { motion } from 'framer-motion';
import { EXPERIENCE } from '../../data/experience';
import ColtraneCircle from '../music/ColtraneCircle';
import StaffFlow from '../music/StaffFlow';
import NoteFall from '../music/NoteFall';
import MusicTimeline from '../music/MusicTimeline';
import MusicRecordings from '../music/MusicRecordings';
import { MusicAudioProvider } from '../../lib/useMusicAudio';
import { useSectionSpy } from '../../lib/section';
import Reveal from '../util/Reveal';

/**
 * Section 05 - Music. Pure black-and-white manuscript paper with flowing staff
 * lines. The Coltrane circle lives in the BACK, off-axis behind the intro - it
 * reacts to the cursor and pulses to whatever's playing in the recordings list.
 */
export default function MusicSection() {
  const ref = useSectionSpy<HTMLElement>('05', 'Music');
  // earliest → latest, so the timeline reads as a journey toward Now
  const musicRoles = EXPERIENCE.filter((x) => x.discipline === 'music').slice().reverse();

  return (
    <section ref={ref} className="sel-mono relative w-full overflow-hidden bg-bone text-ink">
      {/* flowing manuscript-paper backdrop */}
      <StaffFlow />

      <MusicAudioProvider>
        {/* notes drifting right-to-left while a track plays */}
        <NoteFall />

        <div className="relative">
          {/* header band - barlines top & bottom */}
          <div className="border-y-2 border-ink px-4 py-10 md:px-8">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/60">
                05 / What I play
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <h2 className="font-music text-[15vw] font-black uppercase leading-[0.82] md:text-[10vw]">
                  Music
                </h2>
                <span className="hidden whitespace-nowrap font-mono text-xs uppercase text-ink/50 md:block">
                  All brass · Bass · Piano
                </span>
              </div>
            </Reveal>
          </div>

          {/* hero - intro + the circle of fifths centerpiece */}
          <div className="grid grid-cols-1 items-center gap-8 px-4 py-4 md:grid-cols-2 md:px-8">
            {/* intro */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-music text-3xl font-bold italic leading-snug md:text-4xl">
                A multi-instrumentalist who is obsessed with{' '}
                <span className="not-italic underline decoration-2 underline-offset-4">theory</span>.
              </h3>
              <p className="mt-6 max-w-md text-ink/70">
                Every brass instrument, bass, piano - and whatever's in the room. The circle is
                Coltrane's: each chord of <em>Giant Steps</em> drawn as the polygon its notes make
                across the circle of fifths, ringed by the pulse of the beat.{' '}
                <span className="text-ink">Drag your cursor through the web</span> - it pushes back.
                Press play below and it pulses to the music.
              </p>
              <p className="mt-4 font-music text-lg italic text-ink/80">♩ = 120 - Giant Steps (1960)</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/40">
                Giant Steps is queued in the tracks below
              </p>
            </motion.div>

            {/* the circle */}
            <ColtraneCircle />
          </div>

          {/* recordings - Luke's real music (Giant Steps wired; rest coming soon) */}
          <div className="relative px-4 py-12 md:px-8">
            <MusicRecordings />
          </div>

          {/* the journey */}
          <div className="relative px-4 pb-24 pt-8 md:px-8">
            <Reveal>
              <h3 className="mb-10 font-mono text-sm uppercase tracking-widest text-ink/70">
                // The journey <span className="text-ink/40">- where I play</span>
              </h3>
            </Reveal>
            <MusicTimeline roles={musicRoles} />
          </div>
        </div>
      </MusicAudioProvider>
    </section>
  );
}
