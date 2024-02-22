import { useState } from 'react';
import EmojiBtn from '../../assets/UIResource/Chat/EmojiBtn.png';
import ImageButton from '../../components/Buttons/ImageButton';
import JPanel from '../../components/UI/JPanel';
import { emojiMap } from './Emojis';

export function EmojiButton({ onSelect }: { onSelect: (code: string) => void }) {
  const [isSelectorShowing, setIsSelectorShowing] = useState(false);

  return (
    <div onMouseLeave={() => setIsSelectorShowing(false)}>
      <ImageButton defaultImage={EmojiBtn} onClick={() => setIsSelectorShowing(!isSelectorShowing)} noCDN />
      {isSelectorShowing && <EmojiSelector onSelect={onSelect} />}
    </div>
  );
}

function EmojiSelector({ onSelect }: { onSelect: (code: string) => void }) {
  return (
    <JPanel
      width={100}
      height={100}
      style={{ position: 'absolute', transform: 'translateY(-100%) translateY(-28px)' }}
      background="UIResource.Common.SmallBG1"
      padding={4}>
      {Object.entries(emojiMap).map(([key, src]) => (
        <img key={key} className="clickable" src={src} onClick={() => onSelect(key)} />
      ))}
    </JPanel>
  );
}
