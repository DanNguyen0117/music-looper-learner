import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function SpeedControls({ playerRef, onSpeedChange, activeSpeed }) {
  const buttons = [
    { label: '0.25' },
    { label: '0.5' },
    { label: '0.75' },
    { label: '1' },
    { label: '1.25' },
    { label: '1.5' },
    { label: '1.75' },
    { label: '2' },
  ];

  const handleClick = (label) => {
    const speed = Number(label);
    onSpeedChange(speed);
    playerRef.current?.setPlaybackRate(speed);
  };

  return (
    <>
      <div className="mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
        Playback Speed: {activeSpeed}x
      </div>
      <ButtonGroup>
        {buttons.map((button) => (
          <Button
            key={button.label}
            variant={activeSpeed === Number(button.label) ? 'dark' : 'secondary'}
            onClick={() => handleClick(button.label)}
          >
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}

export default SpeedControls;
