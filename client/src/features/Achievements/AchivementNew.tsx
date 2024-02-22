import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JProgressBar } from '../../components/UI/JProgressBar';
import { MultilineLabel } from '../../components/UI/MultilineLabel';

export function Achievement() {
  return (
    <Panel name="Achievement" onClose={() => {}}>
      <JPanel size={{ width: 509, height: 300 }}>
        <JPanel size={{ width: 509, height: 300 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 509, height: 300 }}>
            <JPanel size={{ width: 429, height: 20 }} position={{ x: 40, y: 5 }} background="UIResource.Common.BigBG3">
              <MultilineLabel size={{ width: 429, height: 20 }} style={{ textAlign: 'center' }} text="Achievement Name" />
            </JPanel>

            <JPanel size={{ width: 64, height: 64 }} position={{ x: 10, y: 30 }} background="UIResource.Icon.Grid_HeadPortraitBase2">
              {/* <JPanel size={{ width: 50, height: 50 }} position={{ x: 7, y: 7 }} background="UIResource.Common.BigBG3"></JPanel> */}
            </JPanel>
            <JPanel size={{ width: 50, height: 60 }} position={{ x: 445, y: 30 }} background="UIResource.Common.BigBG3"></JPanel>
            <JProgressBar size={{ width: 345, height: 18 }} position={{ x: 80, y: 275 }} progress={50} />

            <MultilineLabel
              size={{ width: 330, height: 20 }}
              position={{ x: 94, y: 27 }}
              style={{ background: 'green' }}
              text="Txt_TargetContent"
            />

            <MultilineLabel
              size={{ width: 330, height: 20 }}
              position={{ x: 94, y: 47 }}
              style={{ background: 'red' }}
              text="Txt_AwardContent"
            />

            <JButton size={{ width: 64, height: 22 }} position={{ x: 10, y: 100 }} text="MyHonorList_Show" />
            <JPanel size={{ width: 24, height: 24 }} position={{ x: 440, y: 95 }} background="UIResource.Common.BigBG3"></JPanel>
            <JPanel size={{ width: 24, height: 24 }} position={{ x: 475, y: 95 }} background="UIResource.Common.BigBG3"></JPanel>

            {Array(8)
              .fill(null)
              .map((_, idx) => (
                <>
                  <JPanel
                    size={{ width: 24, height: 24 }}
                    position={{ x: 92, y: 72 + 25 * idx }}
                    background="UIResource.Common.BigBG3"></JPanel>
                  <MultilineLabel
                    size={{ width: 280, height: 20 }}
                    position={{ x: 115, y: 74 + 25 * idx }}
                    style={{ background: 'red' }}
                    text="Txt_Content1"
                  />
                </>
              ))}
          </JPanel>
        </JPanel>
      </JPanel>
    </Panel>
  );
}
