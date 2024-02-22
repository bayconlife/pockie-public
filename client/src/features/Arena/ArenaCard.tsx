import * as React from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import { useAppSelector } from '../../hooks';
import { toServer } from '../../util/ServerSocket';

interface Props {
  row: { id: string; level: number; avatar: number; name?: string; win: boolean }[];
  cardRow: number;
}

const ArenaCard: React.FC<Props> = ({ row, cardRow }) => {
  const cards = useAppSelector((state) => state.arena.cards);

  function openPacks() {
    toServer('openArenaCards', { row: cardRow });
  }

  const card =
    row.every((x) => x.win === true) && cards.includes(cardRow) ? (
      <>
        <ImageButton
          defaultImage={`ui/UIResource/Arena/ArenaFighter/${cardRow}_Complete.png`}
          onClick={() => openPacks()}
          style={{ position: 'absolute', bottom: 0, left: 23, pointerEvents: 'none' }}
        />
      </>
    ) : (
      <>
        <ImageButton
          defaultImage={`ui/UIResource/Arena/ArenaFighter/${cardRow}.png`}
          onClick={() => openPacks()}
          style={{ position: 'absolute', bottom: 0, left: 23 }}
          disabled={!row.every((x) => x.win === true)}
        />
      </>
    );
  return card;
};

export default ArenaCard;
