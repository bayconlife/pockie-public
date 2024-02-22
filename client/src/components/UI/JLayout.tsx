interface Props {
  horizontal?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function JLayout({ horizontal = false, children, style }: Props) {
  return (
    <div
      className="j-layout"
      style={{
        display: 'flex',
        gap: 5,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: horizontal ? 'row' : 'column',
        flexWrap: 'wrap',
        width: horizontal ? '100%' : 'auto',
        ...style,
      }}>
      {children}
    </div>
  );
}
