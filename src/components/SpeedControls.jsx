import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import TooltipButton from './TooltipButton';

function SpeedControls({ playerRef, onSpeedChange, activeSpeed }) {
  const slowSpeeds = ['0.25', '0.5', '0.75'];
  const normalSpeed = ['1'];
  const fastSpeeds = ['1.25', '1.5', '1.75', '2'];

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
      <div className="mb-4 speed-controls-group">
        <ButtonGroup>
          {slowSpeeds.map((label) => (
            <TooltipButton
              key={label}
              variant={activeSpeed === Number(label) ? 'primary' : 'secondary'}
              onClick={() => handleClick(label)}
              tooltip={`Set playback speed to ${label}x`}
            >
              {label}
            </TooltipButton>
          ))}
        </ButtonGroup>
        <span className="speed-divider">|</span>
        <ButtonGroup>
          {normalSpeed.map((label) => (
            <TooltipButton
              key={label}
              variant={activeSpeed === Number(label) ? 'primary' : 'secondary'}
              onClick={() => handleClick(label)}
              tooltip="Set playback speed to normal (1x)"
            >
              {label}
            </TooltipButton>
          ))}
        </ButtonGroup>
        <span className="speed-divider">|</span>
        <ButtonGroup>
          {fastSpeeds.map((label) => (
            <TooltipButton
              key={label}
              variant={activeSpeed === Number(label) ? 'primary' : 'secondary'}
              onClick={() => handleClick(label)}
              tooltip={`Set playback speed to ${label}x`}
            >
              {label}
            </TooltipButton>
          ))}
        </ButtonGroup>
      </div>
    </>
  );
}

export default SpeedControls;
