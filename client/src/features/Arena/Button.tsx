import * as React from 'react';
import { CDNImage } from '../../components/Elements/Image';

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
  const [scale, setScale] = React.useState(1);

  function onMouseOver(e: any) {
    setScale(1.25);
  }

  function onMouseOut() {
    setScale(1);
  }

  return (
    <button
      style={{
        background: 'transparent',
        padding: 0,
        position: 'relative',
        whiteSpace: 'nowrap',
        transform: `scale(${scale})`,
        border: 0,
        cursor: 'pointer',
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}>
      <CDNImage src="scenes/arena/button-background.png" style={{ position: 'absolute', top: 0, left: 0 }} />
      <span className="test-text" style={{ position: 'absolute', top: 4, left: 10, fontSize: 16 }}>
        {text}
      </span>
    </button>
  );
};

export default Button;
