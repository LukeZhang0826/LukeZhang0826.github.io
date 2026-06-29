import { useState } from 'react';
import { EXPERIENCE } from '../../data/experience';
import { PROJECTS, type Project } from '../../data/projects';
import ExperienceRow from '../dev/ExperienceRow';
import ProjectCard from '../dev/ProjectCard';
import ProjectCaseStudy from '../dev/ProjectCaseStudy';
import MatrixRain from '../dev/MatrixRain';
import { useSectionSpy } from '../../lib/section';
import Reveal from '../util/Reveal';

/**
 * Section 01 - Development. A deliberate hard cut from the bone hero: dark,
 * data-brutalist "credibility room". Experience as an instrument-panel list,
 * selected work as a Tofu-style featured + grid layout. 100% DOM/CSS/Framer Motion.
 */
export default function DevelopmentSection() {
  const ref = useSectionSpy<HTMLElement>('01', 'Development');
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-ink text-bone">
      {/* subtle Matrix digital-rain backdrop */}
      <MatrixRain />

      {/* header band */}
      <div className="relative z-10 border-y-2 border-bone/30 px-4 py-10 md:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-bone/60">
            01 / What I ship
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <h2 className="font-dev text-[16vw] uppercase leading-[0.82] tracking-tight md:text-[11vw]">
              Development
            </h2>
            <span className="hidden whitespace-nowrap font-mono text-xs uppercase text-bone/50 md:block">
              Eng · 2023 - Now
            </span>
          </div>
        </Reveal>
      </div>

      {/* experience */}
      <div className="relative z-10 px-4 py-16 md:px-8">
        <Reveal>
          <h3 className="mb-8 font-mono text-sm uppercase tracking-widest text-acid">
            // Experience{' '}
            <span className="text-bone/40">- click to expand</span>
          </h3>
        </Reveal>
        <ul className="border-b border-bone/20">
          {EXPERIENCE.filter((x) => x.discipline === 'dev').map((x) => (
            <ExperienceRow key={`${x.company}-${x.start}`} exp={x} />
          ))}
        </ul>
      </div>

      {/* selected work */}
      <div className="relative z-10 px-4 pb-24 md:px-8">
        <Reveal>
          <h3 className="mb-8 font-mono text-sm uppercase tracking-widest text-acid">
            // Selected Work
          </h3>
        </Reveal>
        {/* ProjectCard has its own whileInView entrance + featured md:col-span-2, so it must
            be a DIRECT grid child - do NOT wrap it (a wrapper breaks the full-width span). */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} n={i + 1} onOpen={setCaseStudy} />
          ))}
        </div>
      </div>

      <ProjectCaseStudy project={caseStudy} onClose={() => setCaseStudy(null)} />
    </section>
  );
}
