import { CDNImage } from '../../components/Elements/Image';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppSelector } from '../../hooks';
import { PotItem } from '../../slices/arenaSlice';

interface Props {
  pot: PotItem;
  onView?: () => void;
  onOpen: () => void;
}

enum Pots {
  Elementry = 'Elementry Colored',
  Colorful = 'Gray Outfit Jar',
  Mystery = 'Blue Outfit Jar',
  Junior = 'Orange Outfit Jar',
}

export const PotShopItem: React.FC<Props> = ({ pot, onOpen, onView }) => {
  const Medals = useAppSelector((state) => state.arena.medals);
  return (
    <>
      <JPanel
        size={{ width: 285, height: 160 }}
        childrenStyle={{
          padding: 5,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.4fr',
          gridTemplateRows: '1fr 1fr',
          gridTemplateAreas: "'a b' 'c c'",
          gap: '1px 5px',
          width: 285,
          height: 150,
        }}
        background="UIResource.Common.BigBG4">
        <JPanel
          size={{ width: 110, height: 120 }}
          background="UIResource.Common.BigBG3"
          childrenStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'self-end' }}
          style={{ gridArea: 'a' }}>
          <CDNImage src={`scenes/arena/pots/${pot.id}.png`} />
        </JPanel>
        <JPanel size={{ width: 125, height: 120 }} style={{ gridArea: 'b' }}>
          <MultilineLabel
            size={{ width: 160, height: 20 }}
            text={Object.values(Pots)[pot.id]}
            style={{ textAlign: 'center' }}
            position={{ x: -20, y: 0 }}
          />
          <JTextField
            size={{ width: 160, height: 20 }}
            position={{ x: -20, y: 23 }}
            style={{ textAlign: 'start' }}
            text="Price:"
            background="UIResource.Common.BigBG3"
          />
          <MultilineLabel
            size={{ width: 40, height: 30 }}
            position={{ x: 95, y: 25 }}
            style={{ textAlign: 'end' }}
            text={pot.medals.toString()}
          />
          <MultilineLabel
            size={{ width: 160, height: 30 }}
            position={{ x: -20, y: 50 }}
            text={'no rank requirement'}
            style={{ textAlign: 'center' }}
          />
        </JPanel>
        <JPanel
          size={{ width: 275, height: 30 }}
          style={{ gridArea: 'c' }}
          background="UIResource.Common.BigBG4"
          childrenStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <JButton text="Purchase" onClick={onOpen} disabled={Medals < pot.medals} />
          {/* <JButton size={{ width: 100, height: 23 }} text="View Rewards" onClick={onView} disabled />
          <JButton size={{ width: 70, height: 23 }} text="Open one" onClick={onOpen} disabled={Medals < pot.medals} />
          <JButton size={{ width: 100, height: 23 }} text="Open in bulk" disabled /> */}
        </JPanel>
      </JPanel>
    </>
  );
};
