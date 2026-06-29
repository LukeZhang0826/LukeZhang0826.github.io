import { DESIGN_WORK, type WorkKind } from '../../data/design';
import WorkCard from './WorkCard';
import HScroll from './HScroll';

/**
 * A horizontal gallery of work, filtered by kind so UI/web and graphic/print live in
 * their own rows (placeholders for now).
 */
export default function WorkGallery({ kind, label }: { kind: WorkKind; label: string }) {
  const items = DESIGN_WORK.filter((w) => w.kind === kind);
  return (
    <HScroll label={label}>
      {items.map((piece) => (
        <div key={piece.id} onDragStart={(e) => e.preventDefault()}>
          <WorkCard piece={piece} />
        </div>
      ))}
    </HScroll>
  );
}
