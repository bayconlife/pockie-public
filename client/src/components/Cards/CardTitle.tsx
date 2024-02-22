export function CardTitle() {
  return (
    <>
      <div
        className="outline"
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          textAlign: 'center',
          fontFamily: 'blippo',
          fontSize: 32,
          color: 'yellow',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
        Click on a green card to get a free reward!
      </div>

      <div
        className="outline"
        style={{
          position: 'absolute',
          top: '-125px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          textAlign: 'center',
          fontFamily: 'blippo',
          fontSize: 18,
          color: 'yellow',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
        ~Or pay for a sneak peak~
      </div>
    </>
  );
}
