import './CardReward.css';

import * as React from 'react';
import { JButton } from '../../components/UI/JButton';
import { useAppSelector } from '../../hooks';
import { IItem } from '../../slices/inventorySlice';
import { Item } from '../../components/Item';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import useTranslator from '../../hooks/translate';
import { Backdrop } from '../../components/Backdrop';
import { CDNImage } from '../../components/Elements/Image';
import { prompt } from '../../util/EventEmitter';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

export function CardReward() {
  const t = useTranslator();
  const cbRef = React.useRef<() => void>();

  const fight = useAppSelector((store) => store.fight.show);

  const [show, setShow] = React.useState(false);
  const [items, setItems] = React.useState<(IItem | null)[]>([]);
  const [selected, setSelected] = React.useState(-1);

  React.useEffect(() => {
    toServer('cardCheck');
    fromServer('showCard', (data, cb) => {
      setShow(true);
      setItems(data);
      setSelected(-1);
      cbRef.current = cb;
    });

    return () => {
      cancelFromServer('showCard');
    };
  }, []);

  if (!show || fight) return null;

  return (
    <>
      <Backdrop />
      <CenterContainer>
        <div
          className="outline"
          style={{
            position: 'absolute',
            top: '-150px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            textAlign: 'center',
            fontFamily: 'blippo',
            fontSize: 32,
            color: 'yellow',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
          Click on a green card to get a free reward!
        </div>
        <div
          className="outline"
          style={{
            position: 'absolute',
            top: '-125px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            textAlign: 'center',
            fontFamily: 'blippo',
            fontSize: 18,
            color: 'yellow',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
          ~Or pay for a sneak peak~
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 10 }}>
          {items.map((item, idx) => (
            <div key={`card-${idx}`}>
              <div style={{ position: 'relative' }}>
                <CDNImage
                  src={`ui/UIResource/OutSearch/${selected === -1 ? 'Poke' : 'CardFlipped'}.png`}
                  style={{ cursor: selected === -1 ? 'pointer' : 'default' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (selected !== -1) {
                      return;
                    }

                    toServer('cardSelect', idx, (items: any) => {
                      setItems(items);
                      setSelected(idx);
                    });
                  }}
                />

                {item !== null && (
                  <>
                    <Item
                      item={items[idx]!}
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(-12px)' }}
                      noBackground
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 17,
                        left: 15,
                        fontSize: '0.8rem',
                        fontFamily: 'Arial',
                        width: 80,
                        height: 17,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={t(`item__${item.iid}--name`)}>
                      {t(`item__${item.iid}--name`)}
                    </div>
                  </>
                )}
              </div>

              {item === null && (
                <JButton
                  size={{ width: 75, height: 21 }}
                  text={'Look'}
                  style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 5 }}
                  onClick={() => {
                    prompt('View contents of the card for 10,000 stones?', () => {
                      toServer('cardLook', idx, (item: any) => {
                        const updatedItems = [...items];

                        updatedItems[idx] = item;

                        setItems(updatedItems);
                      });
                    });
                  }}
                />
              )}

              {item !== null && selected === idx && (
                <JButton
                  size={{ width: 75, height: 21 }}
                  text={'Collect'}
                  style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 5 }}
                  onClick={() => {
                    setShow(false);
                    cbRef.current?.();
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </CenterContainer>
    </>
  );
}
