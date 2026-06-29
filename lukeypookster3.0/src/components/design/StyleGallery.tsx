import { STYLE_DICTIONARY } from '../../data/design';
import StyleCard from './StyleCard';
import HScroll from './HScroll';

/** The style dictionary: a horizontal reference wall of clashing graphic-design styles. */
export default function StyleGallery() {
  return (
    <HScroll label={`${STYLE_DICTIONARY.length} styles · drag / shift-scroll →`}>
      {STYLE_DICTIONARY.map((style, i) => (
        <div key={style.id} onDragStart={(e) => e.preventDefault()}>
          <StyleCard style={style} n={i + 1} />
        </div>
      ))}
    </HScroll>
  );
}
