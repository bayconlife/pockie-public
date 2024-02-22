import JPanel from '../../../components/UI/JPanel';
import { Label } from '../../../components/UI/Label';
import { useAppSelector } from '../../../hooks';
import { Limit } from './Limit';

export function ActiveLimits({ onClick }: { onClick: (id: number | null) => void }) {
  const activeLimits = useAppSelector((state) => state.character.bloodlines.active);

  return (
    <JPanel>
      <Label y={15} className="bold sm" text="Active" />
      <JPanel
        className={`${activeLimits[0] && 'clickable'}`}
        x={45}
        size={{ width: 50, height: 50 }}
        background="UIResource.Common.BigBG5"
        padding={2}
        onClick={() => onClick(activeLimits[0])}>
        {activeLimits[0] && <Limit id={activeLimits[0]} />}
      </JPanel>
      <JPanel
        className={`${activeLimits[1] && 'clickable'}`}
        x={100}
        size={{ width: 50, height: 50 }}
        background="UIResource.Common.BigBG5"
        padding={2}
        onClick={() => onClick(activeLimits[1])}>
        {activeLimits[1] && <Limit id={activeLimits[1]} />}
      </JPanel>
      <JPanel
        className={`${activeLimits[2] && 'clickable'}`}
        x={155}
        size={{ width: 50, height: 50 }}
        background="UIResource.Common.BigBG5"
        padding={2}
        onClick={() => onClick(activeLimits[2])}>
        {activeLimits[2] && <Limit id={activeLimits[2]} />}
      </JPanel>
    </JPanel>
  );
}
