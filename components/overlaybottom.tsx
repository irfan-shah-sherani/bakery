export default function OverlayBottom() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full z-40 pointer-events-none translate-y-[1px]"
      style={{
        height: '12px',
        backgroundImage: 'url("/img/overlay-bottom.png")',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%'
      }}
    />
  );
}  