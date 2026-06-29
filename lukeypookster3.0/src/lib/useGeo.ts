import { useEffect, useState } from 'react';

export type Weather = { temp: number; label: string } | null;

// WMO weather-code → short label (https://open-meteo.com docs)
const WMO: [number[], string][] = [
  [[0], 'Clear'],
  [[1, 2], 'Fair'],
  [[3], 'Cloudy'],
  [[45, 48], 'Fog'],
  [[51, 53, 55, 56, 57], 'Drizzle'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'Rain'],
  [[71, 73, 75, 77, 85, 86], 'Snow'],
  [[95, 96, 99], 'Storm'],
];

function codeLabel(code: number): string {
  for (const [codes, label] of WMO) if (codes.includes(code)) return label;
  return 'Clear';
}

/** Instant, no-permission city from the visitor's IANA timezone (its representative city). */
function cityFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "America/Toronto"
    return (tz.split('/').pop() ?? 'Earth').replace(/_/g, ' ');
  } catch {
    return 'Earth';
  }
}

/**
 * The VISITOR's city + current weather for the HUD - NO permission, NO IP lookup. The city
 * comes from the browser timezone; Open-Meteo's free geocoding API turns that city name into
 * coordinates, then its forecast API gives the weather (one provider, no key). Fails soft to
 * the timezone city / null weather. Note: the timezone yields its *representative* city, so
 * weather is regional rather than pinpoint (pinpoint would need GPS/IP).
 */
export function useGeo() {
  const [city, setCity] = useState(cityFromTimezone());
  const [weather, setWeather] = useState<Weather>(null);

  useEffect(() => {
    let alive = true;
    const name = cityFromTimezone();

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`)
      .then((r) => r.json())
      .then((g) => {
        const hit = g?.results?.[0];
        if (!hit) return null;
        if (alive && hit.name) setCity(hit.name);
        return fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}&current=temperature_2m,weather_code`,
        ).then((r) => r.json());
      })
      .then((d) => {
        if (alive && d?.current) {
          setWeather({ temp: Math.round(d.current.temperature_2m), label: codeLabel(d.current.weather_code) });
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return { city, weather };
}
