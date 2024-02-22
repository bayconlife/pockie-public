import * as React from 'react';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { hideMap, showMap } from '../../slices/mapSlice';
import { JButton } from '../../components/UI/JButton';
import { JLayout } from '../../components/UI/JLayout';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

export const SmallMap: React.FC<{}> = () => {
  const t = useTranslator();

  const dispatch = useAppDispatch();

  const scene = useAppSelector((state) => state.scene.scene);
  const isMapShowing = useAppSelector((state) => state.map.show);
  const village = useAppSelector((state) => state.ui.homeVillage);

  const [loading, setLoading] = React.useState(false);

  return (
    <div style={{ position: 'absolute', top: 30, right: 1 }}>
      <CDNImage src="ui/SmallMap/bg.png" style={{ position: 'relative' }} />
      <MultilineLabel
        size={{ width: 125, height: 15 }}
        position={{ x: 8, y: 8 }}
        text={t(`scene__${scene}--name`)}
        style={{ textAlign: 'center', userSelect: 'none' }}
      />
      <JLayout horizontal style={{ position: 'absolute', bottom: 3 }}>
        <JButton
          size={{ width: 50, height: 24 }}
          text={scene === village ? 'Leave' : 'Village'}
          onClick={() => {
            setLoading(true);
            if (scene === village) {
              toServer('previousScene');
            } else {
              toServer('goToVillage');
            }
          }}
          disabled={loading}
          loading={loading}
        />
        <JButton size={{ width: 75, height: 24 }} text={'World Map'} onClick={() => dispatch(isMapShowing ? hideMap() : showMap())} />
      </JLayout>
    </div>
  );
};
