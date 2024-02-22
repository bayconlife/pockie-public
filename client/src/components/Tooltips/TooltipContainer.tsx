import './TooltipContainer.css';

import * as React from 'react';

interface Props {
  offsetX?: number;
  offsetY?: number;
  children?: React.ReactNode;
}

export function TooltipContainer({ offsetX = 0, offsetY = 0, children }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const tooltip = document.getElementById('tooltip');

    if (ref.current && tooltip !== null) {
      tooltip.replaceChildren(ref.current.cloneNode(true));
      tooltip.style.left = (ref.current.getBoundingClientRect().left + offsetX).toString() + 'px';
      tooltip.style.top = (ref.current.getBoundingClientRect().top + offsetY).toString() + 'px';

      if (tooltip.getBoundingClientRect().right > document.body.clientWidth) {
        tooltip.style.left = (ref.current.getBoundingClientRect().left - tooltip.getBoundingClientRect().width).toString() + 'px';
      }

      if (tooltip.getBoundingClientRect().bottom > document.body.clientHeight) {
        tooltip.style.top = (document.body.clientHeight - tooltip.getBoundingClientRect().height).toString() + 'px';
      }
    }

    return () => {
      tooltip?.replaceChildren();
    };
  }, [ref, offsetX, offsetY]);

  return (
    <div ref={ref} id="display">
      {children}
    </div>
  );
}
