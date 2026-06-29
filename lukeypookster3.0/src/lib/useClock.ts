import { useEffect, useState } from 'react';

/**
 * Live HH:MM:SS in a given IANA timezone plus the zone abbreviation (EST/PST/GMT...) -
 * for the brutalist HUD readout. Defaults to the VISITOR's local timezone.
 */
export function useClock(timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const [time, setTime] = useState('--:--:--');
  const [zone, setZone] = useState('EST');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    });
    const zoneFmt = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
    const readZone = () =>
      zoneFmt.formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value ?? 'EST';

    const tick = () => setTime(fmt.format(new Date()));
    tick();
    setZone(readZone());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return { time, zone };
}
