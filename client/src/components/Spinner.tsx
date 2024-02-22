export function Spinner({ width }: { width?: number }) {
  if (!!width) {
    return (
      <div style={{ position: 'relative', width }}>
        <div className="loader" style={{ position: 'relative' }} />
      </div>
    );
  }

  return (
    <>
      <div className="loader" />
    </>
  );
}
