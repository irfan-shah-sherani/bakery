export default function OverlayTop() {
  return (
    <div
      className="absolute top-0 left-0 w-full z-40 pointer-events-none translate-y-[-1px]"
      style={{
        height: '12px',
        backgroundImage: 'url("/img/overlay-top.png")',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%'
      }}
    />
  );
}  