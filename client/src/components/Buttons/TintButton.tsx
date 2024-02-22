import * as React from 'react';
import { CDNImage } from '../Elements/Image';

const TintButton: React.FC<{ defaultImage: string; onClick: () => void; style?: any }> = ({ defaultImage, onClick, style }) => {
  const [filter, setFilter] = React.useState('');

  return (
    <CDNImage
      src={defaultImage}
      onMouseEnter={() => setFilter('brightness(70%)')}
      onMouseLeave={() => setFilter('')}
      onClick={onClick}
      style={{ cursor: 'pointer', filter: `${filter}`, ...style }}
    />
  );
};

export default TintButton;
