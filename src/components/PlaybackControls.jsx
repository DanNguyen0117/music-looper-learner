import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlay,
	faInfinity,
	faForward,
	faForwardFast,
	faPause,
	faBackward,
	faBackwardFast,
	faAngleRight,
	faAnglesRight,
	faAngleLeft,
	faAnglesLeft,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './PlaybackControls.css';

function PlaybackControls({ isPlaying, setIsPlaying, playerRef }) {
	const handleBackward5 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime - 5, true);
	};

	const handleBackward3 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime - 3, true);
	};

	const handleBackward1 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime - 1, true);
	};

	const handleBackwardFrame = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime - 0.04, true); // estimate on frame
	};

	const handleForward5 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime + 5, true);
	};

	const handleForward3 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime + 3, true);
	};

	const handleForward1 = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime + 1, true);
	};

	const handleForwardFrame = () => {
		const currentTime = playerRef.current?.getCurrentTime();
		playerRef.current?.seekTo(currentTime + 0.04, true); // estimate on frame
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
	const buttons = [
		{ icon: faBackwardFast, label: '-5s', id: 'backward-5', handler: handleBackward5 },
		{ icon: faBackward, label: '-3s', id: 'backward-3', handler: handleBackward3 },
		{ icon: faAnglesLeft, label: '-1s', id: 'backward-1', handler: handleBackward1 },
		{ icon: faAngleLeft, label: '-1f', id: 'backward-frame', handler: handleBackwardFrame },
		{ icon: isPlaying ? faPause : faPlay, label: isPlaying ? 'Pause' : 'Play', id: 'toggle-play', handler: handlePlayPause },
		{ icon: faAngleRight, label: '+1f', id: 'forward-frame', handler: handleForwardFrame },
		{ icon: faAnglesRight, label: '+1s', id: 'forward-1', handler: handleForward1 },
		{ icon: faForward, label: '+3s', id: 'forward-3', handler: handleForward3 },
		{ icon: faForwardFast, label: '+5s', id: 'forward-5', handler: handleForward5 },
	];

	return (
		<Container className="mb-3 d-flex flex-wrap justify-content-center">
			{buttons.map(({ icon, label, id, handler }) => (
				<div className={`text-center ${id === 'forward-5' ? '' : 'me-3'}`} key={id}>
					<Button variant="dark" className="playback" onClick={handler}>
						<FontAwesomeIcon icon={icon} />
					</Button>
					<div className="help-text">{label}</div>
				</div>
			))}
		</Container>
	);
}

export default PlaybackControls;
