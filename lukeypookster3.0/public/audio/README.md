# Section 05 - Music audio

Drop track files here. They're served from the site root, so a file at
`public/audio/giant-steps.mp3` is referenced as `/audio/giant-steps.mp3`.

Currently wired (see `src/components/music/MusicRecordings.tsx`):

- `giant-steps.mp3` - Track 01. Playing it drives the Coltrane circle's spectrum
  (the bars react to the real audio via the Web Audio AnalyserNode).

Add more tracks by giving them an `src` in the `TRACKS` array in `MusicRecordings.tsx`.
