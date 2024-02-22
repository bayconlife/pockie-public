import { useEffect, useState } from 'react';
import ImageButton from '../Buttons/ImageButton';
import JPanel from './JPanel';
import { JLayout } from './JLayout';

interface Props {
  perPage: number;
  items: any[];
  render: (items: any[], page: number) => React.ReactNode;
  style?: React.CSSProperties;
  width?: number;
  noNumbers?: boolean;
  paginationStyle?: React.CSSProperties;
}

export function JPagination({ perPage, items, render, style, width = 176, noNumbers = false, paginationStyle }: Props) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [items.length]);

  const renderedItems = items.slice(page * perPage, page * perPage + perPage);

  while (renderedItems.length < perPage) {
    renderedItems.push(undefined);
  }

  return (
    <JLayout style={style}>
      {render(renderedItems, page)}

      <JPanel
        size={{ width, height: 20 }}
        background="UIResource.Common.SmallBG1"
        style={{ display: 'flex', justifyContent: 'center', ...paginationStyle }}>
        <ImageButton
          disabled={page === 0}
          defaultImage="ui/UILookAndFeel/Scroll/ArrowRight.png"
          onClick={() => setPage(page - 1)}
          style={{ position: 'absolute', left: 10, top: 0, transform: 'scaleX(-1)' }}
        />
        {!noNumbers && (
          <div style={{ textAlign: 'center', fontSize: '1em' }}>
            {items.length === 0 ? page : page + 1}/{Math.ceil(items.length / perPage)}
          </div>
        )}
        {noNumbers && <div style={{ textAlign: 'center', fontSize: '1em' }}>{items.length === 0 ? page : page + 1}</div>}
        <ImageButton
          disabled={page + 1 >= Math.ceil(items.length / perPage)}
          defaultImage="ui/UILookAndFeel/Scroll/ArrowRight.png"
          onClick={() => setPage(page + 1)}
          style={{ position: 'absolute', right: 10, top: 0 }}
        />
      </JPanel>
    </JLayout>
  );
}
