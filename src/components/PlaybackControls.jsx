import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './PlaybackControls.css';

// const buttons = [
// 		{ icon: faBackwardFast, label: '-5s', id: 'backward-5', handler: handleBackward5 },
// 		{ icon: faBackward, label: '-3s', id: 'backward-3', handler: handleBackward3 },
// 		{ icon: faAnglesLeft, label: '-1s', id: 'backward-1', handler: handleBackward1 },
// 		{ icon: faAngleLeft, label: '-1f', id: 'backward-frame', handler: handleBackwardFrame },
// 		{ icon: isPlaying ? faPause : faPlay, label: isPlaying ? 'Pause' : 'Play', id: 'toggle-play', handler: handlePlayPause },
// 		{ icon: faAngleRight, label: '+1f', id: 'forward-frame', handler: handleForwardFrame },
// 		{ icon: faAnglesRight, label: '+1s', id: 'forward-1', handler: handleForward1 },
// 		{ icon: faForward, label: '+3s', id: 'forward-3', handler: handleForward3 },
// 		{ icon: faForwardFast, label: '+5s', id: 'forward-5', handler: handleForward5 },
// 	];
	
function PlaybackControls({ isPlaying, setIsPlaying, playerRef }) {
  const handleBackward = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    playerRef.current?.seekTo(Math.max(0, currentTime - 5), true);
  };

  const handleForward = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    const duration = playerRef.current?.getDuration();
    playerRef.current?.seekTo(Math.min(duration, currentTime + 5), true);
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      playerRef.current?.playVideo();
      setIsPlaying(true);
    } else {
      playerRef.current?.pauseVideo();
      setIsPlaying(false);
    }
  };

  return (
    <Container className="mb-3 d-flex flex-wrap justify-content-center">
      <div className="text-center me-3">
        <Button variant="secondary" className="playback" onClick={handleBackward}>
          <FontAwesomeIcon icon={faBackward} />
        </Button>
        <div className="help-text">-5s</div>
      </div>
      <div className="text-center me-3">
        <Button variant="secondary" className="playback" onClick={handlePlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </Button>
        <div className="help-text">{isPlaying ? 'Pause' : 'Play'}</div>
      </div>
      <div className="text-center">
        <Button variant="secondary" className="playback" onClick={handleForward}>
          <FontAwesomeIcon icon={faForward} />
        </Button>
        <div className="help-text">+5s</div>
      </div>
    </Container>
  );
}

export default PlaybackControls;
