import ImageButton from '../../components/Buttons/ImageButton';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import useTranslator from '../../hooks/translate';
import { useAppDispatch } from '../../hooks';
import { showOutfits } from '../../slices/dungeonSlice';
import { useEffect, useRef, useState } from 'react';
import { CDNImage } from '../../components/Elements/Image';
import ButtonImage from '../../assets/valhalla/button.png';
import { toServer } from '../../util/ServerSocket';

export function Challenge({ info, onClose }: { info: any; onClose: () => void }) {
  const countRef = useRef(0);
  const dispatch = useAppDispatch();
  const t = useTranslator();
  const [loaded, setLoaded] = useState(false);

  function load() {
    countRef.current++;

    if (countRef.current >= 2) {
      setLoaded(true);
    }
  }

  return (
    <CenterContainer zIndex={99} style={{ opacity: loaded ? 1 : 0 }}>
      <CDNImage src="scenes/valhalla/challenge/bg.png" onLoad={() => load()} />
      <CDNImage
        src={`scenes/valhalla/${info.id}.png`}
        width={355}
        height={200}
        style={{ position: 'absolute', top: 65, left: 75, borderRadius: 14 }}
        onLoad={() => load()}
      />
      <div data-text="Challenge Stage" className="valhalla__difficulty__name" />
      <MultilineLabel size={{ width: 335, height: 42 }} position={{ x: 86, y: 279 }} style={{ fontSize: 11 }} text={t('valhalla__rules')} />
      <ImageButton defaultImage="scenes/valhalla/close.png" onClick={onClose} style={{ position: 'absolute', left: 422, top: 7 }} />

      <MultilineLabel
        size={{ width: 88, height: 18 }}
        position={{ x: 79, y: 339 }}
        style={{ textAlign: 'right' }}
        text={t('valhalla__location_amount')}
      />
      <MultilineLabel
        size={{ width: 54, height: 17 }}
        position={{ x: 177, y: 340 }}
        style={{ textAlign: 'center' }}
        text={'' + info.locations}
      />

      <MultilineLabel
        size={{ width: 88, height: 18 }}
        position={{ x: 79, y: 372 }}
        style={{ textAlign: 'right' }}
        text={t('valhalla__party_limit')}
      />
      <MultilineLabel
        size={{ width: 250, height: 18 }}
        position={{ x: 177, y: 372 }}
        style={{ textAlign: 'center' }}
        text={info.partyLimit}
      />

      <MultilineLabel
        size={{ width: 88, height: 18 }}
        position={{ x: 79, y: 402 }}
        style={{ textAlign: 'right' }}
        text={t('valhalla__rewards')}
      />
      <HorizontalScrollDiv
        style={{
          position: 'absolute',
          fontSize: '0.75rem',
          left: 177,
          top: 402,
          width: 250,
          height: 18,
          overflowX: 'hidden',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
        }}>
        {info.cards.map((id: number) => t(`item__${id}--name`)).join(',')}
      </HorizontalScrollDiv>

      <ImageButton
        defaultImage={''}
        onClick={() => toServer('dungeonStart', { id: info.id, difficulty: info.difficulty })}
        style={{ position: 'absolute', left: 69, top: 427 }}>
        <img src={ButtonImage} />
        <p style={{ margin: 'auto' }}>{t('valhalla__begin')}</p>
      </ImageButton>

      <ImageButton
        defaultImage={''}
        onClick={() => dispatch(showOutfits())}
        style={{ position: 'absolute', left: 309, top: 427 }}
        disabled={info.sets.length === 0}>
        <img src={ButtonImage} />
        <p style={{ margin: 'auto' }}>{t('valhalla__outfits')}</p>
      </ImageButton>
    </CenterContainer>
  );
}

function HorizontalScrollDiv({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        ref.current!.scrollLeft += evt.deltaY;
      });
    }
  }, []);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
