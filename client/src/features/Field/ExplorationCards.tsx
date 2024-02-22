import './ExplorationCards.css';

import { useState } from 'react';
import { JButton } from '../../components/UI/JButton';
import { useAppSelector } from '../../hooks';
import { IItem } from '../../slices/inventorySlice';
import { Item } from '../../components/Item';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import useTranslator from '../../hooks/translate';
import { Backdrop } from '../../components/Backdrop';
import { CDNImage } from '../../components/Elements/Image';
import { CardTitle } from '../../components/Cards/CardTitle';
import JPanel from '../../components/UI/JPanel';
import { prompt } from '../../util/EventEmitter';
import { preventClicks } from '../../util/mouse';
import { toServer } from '../../util/ServerSocket';

export function ExplorationCards() {
  const fight = useAppSelector((store) => store.fight.show);
  const exploration = useAppSelector((state) => state.character.exploration);

  const selected = exploration.cards.selected;

  function generateCardType(card: [number, IItem], idx: number) {
    switch (card?.[0] ?? -1) {
      case 0:
        return <MonsterCard item={card[1]} idx={idx} selected={selected} />;
      case 1:
        return <StonesCard item={card[1]} idx={idx} selected={selected} />;
      case 4:
        return <PetCard item={card[1]} idx={idx} selected={selected} />;
      case 5:
        return <ItemCard item={card[1]} idx={idx} selected={selected} />;
      default:
        return <UnknownCard idx={idx} />;
    }
  }

  if (exploration.cards.cards.length === 0 || fight) {
    return null;
  }

  return (
    <>
      <Backdrop />
      <CenterContainer>
        <CardTitle />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 10 }}>
          {exploration.cards.cards.map((card, idx) => (
            <div key={`card-${idx}`}>
              <div style={{ position: 'relative' }}>
                <CDNImage
                  src={`ui/UIResource/OutSearch/${card === null ? 'Poke' : 'CardFlipped'}.png`}
                  style={{ cursor: selected === -1 ? 'pointer' : 'default' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (selected !== -1) {
                      return;
                    }

                    toServer('exploreCardSelect', idx);
                  }}
                  onMouseEnter={(e) => preventClicks(e)}
                  onMouseLeave={(e) => preventClicks(e)}
                  onMouseDown={(e) => preventClicks(e)}
                  onMouseUp={(e) => preventClicks(e)}
                />

                {generateCardType(card, idx)}
              </div>
            </div>
          ))}
        </div>
      </CenterContainer>
    </>
  );
}

function ItemName({ iid }: { iid: number }) {
  const t = useTranslator();

  return (
    <JPanel size={{ width: 80, height: 18 }} position={{ x: 15, y: 117 }}>
      <div className="exploration__card--name" title={`${t(`item__${iid}--name`)} Stones`}>
        {t(`item__${iid}--name`)}
      </div>
    </JPanel>
  );
}

function UnknownCard({ idx }: { idx: number }) {
  const cards = useAppSelector((state) => state.character.exploration.cards);

  if (cards.selected !== -1 || cards.cards.filter((card) => card !== null).length >= 3) {
    return null;
  }

  return (
    <JButton
      className="exploration__card--button"
      size={{ width: 90, height: 21 }}
      text={'Buy Peek'}
      onClick={() => {
        prompt('View contents of the card for 10,000 stones?', () => toServer('exploreCardPeek', idx));
      }}
    />
  );
}

function ItemCard({ item, idx, selected }: { item: IItem; idx: number; selected: number }) {
  return (
    <>
      <Item
        item={item}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%) translateY(-6px)' }}
        noBackground
      />
      <ItemName iid={item.iid} />
      {(selected === -1 || selected === idx) && (
        <JButton
          className="exploration__card--button"
          size={{ width: 90, height: 21 }}
          text={'Claim Item'}
          onClick={() => toServer('exploreCardClaim', idx)}
        />
      )}
    </>
  );
}

function MonsterCard({ item, idx, selected }: { item: IItem; idx: number; selected: number }) {
  const t = useTranslator();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <JPanel position={{ x: 30, y: 40 }}>
        <CDNImage src={`icons/monsters/${item.props.avatar}.png`} width="50" height="50" />
      </JPanel>
      <JPanel size={{ width: 80, height: 18 }} position={{ x: 15, y: 117 }}>
        <div className="exploration__card--name" title={t(`monster__${item.iid}--name`)}>
          {t(`monster__${item.iid}--name`)}
        </div>
      </JPanel>
      {(selected === -1 || selected === idx) && (
        <JButton
          className="exploration__card--button"
          size={{ width: 90, height: 21 }}
          text={'Fight'}
          loading={loading}
          onClick={() => {
            setLoading(true);
            toServer('exploreCardClaim', idx);
          }}
        />
      )}
    </>
  );
}

function PetCard({ item, idx, selected }: { item: IItem; idx: number; selected: number }) {
  return (
    <>
      <Item
        item={item}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%) translateY(6px)' }}
        noBackground
      />
      <ItemName iid={item.iid} />
      {(selected === -1 || selected === idx) && (
        <JButton
          className="exploration__card--button"
          size={{ width: 90, height: 21 }}
          text={'Start Capture'}
          onClick={() => toServer('exploreCardClaim', idx)}
        />
      )}
    </>
  );
}

function StonesCard({ item, idx, selected }: { item: IItem; idx: number; selected: number }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <JPanel position={{ x: 30, y: 40 }}>
        <CDNImage src={`ui/UIResource/Icon/IconOutSearch1.png`} width="50" height="50" />
      </JPanel>
      <JPanel size={{ width: 80, height: 18 }} position={{ x: 15, y: 117 }}>
        <div className="exploration__card--name" title={`${item.props?.stones} Stones`}>
          {`${item.props?.stones} Stones`}
        </div>
      </JPanel>
      {(selected === -1 || selected === idx) && (
        <JButton
          className="exploration__card--button"
          size={{ width: 90, height: 21 }}
          text={'Claim'}
          loading={loading}
          onClick={() => {
            setLoading(true);
            toServer('exploreCardClaim', idx);
          }}
        />
      )}
    </>
  );
}
