import { useEffect, useState } from 'react';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import useTranslator from '../../hooks/translate';
import { useAppSelector } from '../../hooks';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { Item } from '../../components/Item';
import { DropZone } from '../../components/DropZone/DropZone';
import Panel from '../../components/Panel/Panel';
import { JScrollPane } from '../../components/UI/JScollPane';
import { Label } from '../../components/UI/Label';
import { toServer } from '../../util/ServerSocket';

const v = [14, 22, 31, 39, 46];
const INFO =
  '1. Set a main item and two catalyst to view the resulting  possible item.<br/>' +
  '2. If the result is an equippable item then the # of stats (0s, 1s, 2s, 3s, 4s) coresponds to the value below result.<br/>' +
  '2a. 00-21 = 0s<br/>' +
  '2b. 22-30 = 1s<br/>' +
  '2c. 31-38 = 2s<br/>' +
  '2d. 39-45 = 3s<br/>' +
  '2e. 46+   = 4s<br/>' +
  '3. If the result is a pet or outfit then the upgrade chance will be shown.<br/>' +
  '4. If the result is a random item then consult the Recipes chart using the button below to see the possible results.<br/>';

export function Synthesis() {
  const t = useTranslator();

  const locations = useAppSelector((state) => state.inventory.locations);

  const [recipe, setRecipe] = useState<string | number>('');
  const [range, setRange] = useState([0, 0]);
  const [rate, setRate] = useState<number>();
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    if (20 in locations && 21 in locations && 22 in locations) {
      toServer('synthesisRecipeName', {}, ({ item, range, rate }: { item: string | number; range: [number, number]; rate?: number }) => {
        setRecipe(item);

        if (range) {
          setRange(range);
        }

        setRate(rate);
      });
    } else {
      setRecipe('');
      setRate(undefined);
    }
  }, [locations]);

  let name = '';

  if (recipe !== '') {
    name = typeof recipe === 'string' ? t(recipe) : t(`item__${recipe}--name`);
  }

  return (
    <>
      <JPanel size={{ width: 366, height: 350 - 26 }} background="UIResource.Common.BigBG1">
        <JPanel size={{ width: 356, height: 90 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 346, height: 80 }} position={{ x: 5, y: 5 }} text={INFO} />
        </JPanel>

        <JButton
          size={{ width: 76, height: 20 }}
          position={{ x: 145, y: 105 }}
          text={'Recipes'}
          onClick={() => setShowRecipes(!showRecipes)}
        />

        <JPanel size={{ width: 356, height: 173 }} position={{ x: 5, y: 130 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 73, height: 117 }} position={{ x: 5, y: 8 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 63, height: 18 }} position={{ x: 5, y: 3 }} text="Main Item" />
            <GridContainer position={{ x: 5, y: 22 }} location={20} />
          </JPanel>

          <JPanel size={{ width: 144, height: 117 }} position={{ x: 105, y: 8 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 134, height: 18 }} position={{ x: 5, y: 3 }} text="Catalyst" style={{ textAlign: 'center' }} />
            <GridContainer position={{ x: 5, y: 22 }} location={21} />
            <GridContainer position={{ x: 76, y: 22 }} location={22} />
          </JPanel>

          <JPanel size={{ width: 73, height: 117 }} position={{ x: 278, y: 8 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 63, height: 18 }} position={{ x: 5, y: 3 }} text="Result" style={{ textAlign: 'center' }} />
            <GridContainer position={{ x: 5, y: 22 }} location={23}>
              {!(23 in locations) && (
                <JPanel size={{ width: 55, height: 82 }} position={{ x: 4, y: 4 }} background={'UIResource.Compose.Interrogation'} />
              )}
            </GridContainer>
          </JPanel>

          <JPanel size={{ width: 24, height: 16 }} position={{ x: 252, y: 58 }} background="UIResource.Compose.Amount"></JPanel>
          <JPanel size={{ width: 23, height: 23 }} position={{ x: 80, y: 55 }} background="UIResource.Compose.Add"></JPanel>
          <JPanel size={{ width: 138, height: 20 }} position={{ x: 108, y: 140 }} background="UIResource.Common.BigBG3">
            <Label className="sm" position={{ x: 0, y: 2 }} text={name} style={{ textAlign: 'center' }} />
          </JPanel>
          <JPanel size={{ width: 73, height: 20 }} position={{ x: 278, y: 140 }} background="UIResource.Common.BigBG3">
            {range[0] !== 0 && range[1] !== 0 && rate === undefined && (
              <MultilineLabel
                size={{ width: 83, height: 20 }}
                position={{ x: -5, y: 2 }}
                text={recipe !== '' ? `[${range[0]} - ${range[1]}]` : ''}
                style={{ textAlign: 'center' }}
              />
            )}
            {rate !== undefined && (
              <MultilineLabel
                size={{ width: 83, height: 20 }}
                position={{ x: -5, y: 2 }}
                text={rate + '%'}
                style={{ textAlign: 'center' }}
              />
            )}
          </JPanel>
        </JPanel>
      </JPanel>

      <JButton
        size={{ width: 76, height: 22 }}
        position={{ x: 149, y: 330 }}
        disabled={recipe === ''}
        onClick={() => toServer('synthesisCreate')}
        text={'Create'}
      />

      {showRecipes && <Recipes onClose={() => setShowRecipes(false)} />}
    </>
  );
}
const GridContainer: React.FC<{ position: { x: number; y: number }; location?: number }> = ({ position, location = -1, children }) => {
  const item = useAppSelector((store) => store.inventory.items[store.inventory.locations[location]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);

  const onDrop = (uid: string) => {
    toServer('synthesisSetItem', { uid, location });
  };

  return (
    <JPanel
      className="single-container"
      size={{ width: 63, height: 90 }}
      position={position}
      background="UIResource.Icon.Grid_Base1"
      childrenStyle={{ display: 'flex' }}>
      <JPanel size={{ width: 53, height: 80 }} position={{ x: 5, y: 5 }}>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 0 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 27 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 54 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 0 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 27 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 54 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
      </JPanel>

      {children}

      {item && <Item item={item} />}
      {[20, 21, 22].includes(location) && item === undefined && dragging !== null && <DropZone onDrop={onDrop} location={location} />}
    </JPanel>
    // <Grid size={{ width: 2, height: 3 }} position={position}>
    //   {children}

    //   {item && <Item item={item} />}
    //   {[20, 21, 22].includes(location) && item === undefined && dragging !== null && <DropZone onDrop={onDrop} />}
    // </Grid>
  );
};

function Recipes({ onClose }: { onClose: () => void }) {
  const t = useTranslator();

  return (
    <Panel name="Synthesis Recipes" onClose={onClose}>
      <JPanel size={{ width: 450, height: 370 }} background="UIResource.Common.BigBG1">
        <table>
          <thead>
            <tr>
              <th>Result Value</th>
              <th style={{ width: '100%' }}>Possible Items</th>
            </tr>
          </thead>
        </table>
        <JScrollPane size={{ width: 465, height: 320 }} hidden>
          <table>
            <tbody>
              {Object.keys(SERVER_CONFIG.SYNTHESISRECIPES).map((value) => (
                <tr key={value}>
                  <td>{value}</td>
                  <td>{SERVER_CONFIG.SYNTHESISRECIPES[value].map((iid: string) => t(`item__${iid}--name`) + ', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </JScrollPane>
      </JPanel>
    </Panel>
  );
}
