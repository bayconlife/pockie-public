import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JProgressBar } from '../../components/UI/JProgressBar';
import { MultilineLabel } from '../../components/UI/MultilineLabel';

export function Achievements() {
  return (
    <Panel name="Achievements">
      <JPanel size={{ width: 530, height: 406 }}>
        <JPanel size={{ width: 530, height: 126 }} position={{ x: 0, y: 0 }} background="UIResource.Achievement.AchievementBG12" />
        <JPanel size={{ width: 530, height: 280 }} position={{ x: 0, y: 126 }} background="UIResource.Achievement.AchievementBG13" />

        <JPanel size={{ width: 510, height: 300 }} position={{ x: 10, y: 96 }} background="UIResource.Achievement.AchievementBG4">
          <JPanel size={{ width: 509, height: 300 }}>
            <JPanel size={{ width: 64, height: 64 }} position={{ x: 5, y: 5 }} background="UIResource.Achievement.AchievementBG6">
              <JPanel size={{ width: 50, height: 50 }} position={{ x: 7, y: 7 }} background="UIResource.Common.BigBG3"></JPanel>
            </JPanel>
            <JPanel size={{ width: 50, height: 60 }} position={{ x: 445, y: 10 }} background="UIResource.Common.BigBG3"></JPanel>
            <JProgressBar size={{ width: 345, height: 18 }} position={{ x: 75, y: 275 }} />

            <MultilineLabel
              size={{ width: 330, height: 20 }}
              position={{ x: 94, y: 47 }}
              style={{ background: 'red' }}
              text="Txt_AwardContent"
            />

            <MultilineLabel
              size={{ width: 330, height: 20 }}
              position={{ x: 94, y: 27 }}
              style={{ background: 'green' }}
              text="Txt_TargetContent"
            />
            <MultilineLabel
              size={{ width: 330, height: 20 }}
              position={{ x: 94, y: 2 }}
              style={{ textAlign: 'center' }}
              text="Achievement Name"
            />

            <JButton size={{ width: 64, height: 22 }} position={{ x: 5, y: 75 }} text="MyHonorList_Show" />
            <JPanel size={{ width: 24, height: 24 }} position={{ x: 440, y: 65 }} background="UIResource.Common.BigBG3"></JPanel>
            <JPanel size={{ width: 24, height: 24 }} position={{ x: 475, y: 65 }} background="UIResource.Common.BigBG3"></JPanel>

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

      <JButton size={{ width: 16, height: 16 }} position={{ x: 500, y: 60 }} text="Close" />
    </Panel>
  );
}
