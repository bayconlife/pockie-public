import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JLayout } from '../../components/UI/JLayout';
import JPanel from '../../components/UI/JPanel';
import { IItem } from '../../slices/inventorySlice';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { toServer } from '../../util/ServerSocket';

export function FarmOptions({ onClose, selectedPlot }: { onClose: () => void; selectedPlot: number }) {
  return (
    <Panel onClose={onClose}>
      <JPanel size={{ width: 500, height: '' }} background="UIResource.Common.BigBG2" padding={8}>
        <JLayout horizontal>
          {SERVER_CONFIG.HOME?.farm?.map((i: [IItem, number, number]) => (
            <FarmItem i={i} selectedPlot={selectedPlot} onClose={onClose} />
          ))}
        </JLayout>
      </JPanel>
    </Panel>
  );
}

function FarmItem({ i, selectedPlot, onClose }: { i: [IItem, number, number]; selectedPlot: number; onClose: () => void }) {
  return (
    <JPanel size={{ width: 150, height: 120 }} background="UIResource.Common.BigBG3" layout={<JLayout />} padding={4}>
      <DisplayGrid size={{ width: 1, height: 1 }}>
        {i[0] && <Item item={i[0]} style={{ position: 'relative', top: 0, left: 0 }} onClick={() => {}} />}
      </DisplayGrid>
      <div>Cost: {i[1]}</div>
      <div>Time: {new Date(i[2]).toISOString().substring(11, 19)}</div>
      <JButton
        size={{ width: 38, height: 22 }}
        text="Buy"
        onClick={() => toServer('purchasePlot', { id: selectedPlot, plantId: i[0].iid }, () => onClose())}
      />
    </JPanel>
  );
}
