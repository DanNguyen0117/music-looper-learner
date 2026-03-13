import { useEffect, useRef, useState, useCallback } from 'react';
import PlaybackControls from './components/PlaybackControls';
import LoopControls from './components/LoopControls';
import SpeedControls from './components/SpeedControls';
import ShiftLoopControls from './components/ShiftLoopControls';
import Timeline from './components/Timeline';
import LoopPresets from './components/LoopPresets';
import DarkModeToggle from './components/DarkModeToggle';
import TooltipButton from './components/TooltipButton';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import './App.css';
import YouTube from 'react-youtube';
import { HMSToSeconds, roundToNearest05 } from './utils/secondsToHMS';

const sampleVideos = ['4RaR210hglo', 'ngFdSR_aqdI', 'WNcsUNKlAKw', 'aeB43h2SiTM', 'wCINvavqFXk'];

function App() {
	const [videoURL, setVideoURL] = useState('');
	const [videoCode, setVideoCode] = useState(sampleVideos[0]);
	const [currentTime, setCurrentTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [sampleVideoIndex, setSampleVideoIndex] = useState(0);
	const [toggleLoop, setToggleLoop] = useState(false);
	const [isLoopedOnce, setIsLoopedOnce] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [playbackSpeed, setPlaybackSpeed] = useState(1);

	const [startMinutes, setStartMinutes] = useState(0);
	const [startSeconds, setStartSeconds] = useState(0);
	const [endMinutes, setEndMinutes] = useState(0);
	const [endSeconds, setEndSeconds] = useState(0);

	const player = useRef(null);
	const VIDEO_K = 22;

	useEffect(() => {
		const interval = setInterval(() => {
			const current = player.current?.getCurrentTime();
			if (current !== undefined) setCurrentTime(current);
		}, 50);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
			if (!player.current) return;

			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					player.current.seekTo(Math.max(0, player.current.getCurrentTime() - 5), true);
					break;
				case 'ArrowRight':
					e.preventDefault();
					player.current.seekTo(player.current.getCurrentTime() + 5, true);
					break;
				case '[':
					e.preventDefault();
					player.current.seekTo(Math.max(0, player.current.getCurrentTime() - 0.05), true);
					break;
				case ']':
					e.preventDefault();
					player.current.seekTo(player.current.getCurrentTime() + 0.05, true);
					break;
				case 'l':
				case 'L':
					e.preventDefault();
					handleToggleLoop();
					break;
				case '1':
					e.preventDefault();
					handleLoopOnce();
					break;
				case 's':
				case 'S':
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();
						const total = player.current.getCurrentTime();
						setStartMinutes(Math.floor(total / 60));
						setStartSeconds(roundToNearest05(total % 60));
					}
					break;
				case 'e':
				case 'E':
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();
						const total = player.current.getCurrentTime();
						setEndMinutes(Math.floor(total / 60));
						setEndSeconds(roundToNearest05(total % 60));
					}
					break;
				default:
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [startMinutes, startSeconds, endMinutes, endSeconds, endTime, toggleLoop, handleLoopOnce, handleToggleLoop]);

	const handleToggleLoop = useCallback(() => {
		const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
		if (!player.current || startLoopTime > endTime || endLoopTime > endTime || startLoopTime >= endLoopTime) return;

		setToggleLoop((prev) => !prev);
		if (!toggleLoop) {
			player.current.seekTo(startLoopTime, true);
			player.current.playVideo();
		} else {
			player.current.pauseVideo();
		}
	}, [startMinutes, startSeconds, endMinutes, endSeconds, endTime, toggleLoop]);

	const handleLoopOnce = useCallback(() => {
		const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
		if (!player.current || startLoopTime >= endLoopTime) return;

		setIsLoopedOnce(true);
		player.current.seekTo(startLoopTime, true);
		player.current.playVideo();
	}, [startMinutes, startSeconds, endMinutes, endSeconds]);

	const handleStopLoopOnce = () => {
		setIsLoopedOnce(false);
		player.current?.pauseVideo();
	};

	const handleURLChange = (e) => {
		e.preventDefault();
		setVideoURL(e.target.value);
		setErrorMessage('');
	};

	const handleYoutubeSubmit = (event) => {
		event.preventDefault();
		const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)&?/;
		if (youtubeRegex.test(videoURL)) {
			const code = videoURL.split('v=')[1].split('&')[0];
			setVideoCode(code);
			setErrorMessage('');
			setToggleLoop(false);
		} else {
			setErrorMessage('Invalid YouTube URL');
		}
	};

	const handleSampleVideo = () => {
		const index = sampleVideoIndex === sampleVideos.length - 1 ? 0 : sampleVideoIndex + 1;
		setVideoCode(sampleVideos[index]);
		setSampleVideoIndex(index);
		setErrorMessage('');
		setToggleLoop(false);
	};

	const onReady = (event) => {
		setIsPlaying(true);
		player.current = event.target;
		const duration = event.target.getDuration();
		setEndTime(duration);
		const t = secondsToHMSTuple(duration - 1);
		setStartMinutes(0);
		setStartSeconds(0);
		setEndMinutes(t.minutes);
		setEndSeconds(t.seconds);
	};

	const handleSpeedChange = (speed) => {
		setPlaybackSpeed(speed);
		player.current?.setPlaybackRate(speed);
	};

	const handleSeek = (timestamp) => {
		player.current?.seekTo(timestamp, true);
	};

	const handleLoopStartChange = (newStart) => {
		setStartMinutes(Math.floor(newStart / 60));
		setStartSeconds(newStart % 60);
	};

	const handleLoopEndChange = (newEnd) => {
		setEndMinutes(Math.floor(newEnd / 60));
		setEndSeconds(newEnd % 60);
	};

	const handleLoadPreset = (preset) => {
		setVideoCode(preset.videoCode);
		setStartMinutes(preset.startMinutes);
		setStartSeconds(preset.startSeconds);
		setEndMinutes(preset.endMinutes);
		setEndSeconds(preset.endSeconds);
		handleSpeedChange(preset.speed);
	};

	const secondsToHMSTuple = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);
		return { minutes, seconds };
	};

	const opts = {
		height: '100%',
		width: '100%',
		playerVars: {
			autoplay: 1,
			iv_load_policy: 3,
		},
	};

	const loopStartTime = HMSToSeconds(0, startMinutes, startSeconds);
	const loopEndTime = HMSToSeconds(0, endMinutes, endSeconds);

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
				<h1 className="mb-0">Music Looper Learner!</h1>
				<DarkModeToggle />
			</div>

			<Container style={{ maxWidth: '800px' }} className="mb-2">
				<Form className="d-flex gap-3 align-items-center">
					<Form.Control style={{ flexGrow: 1 }} size="normal" type="text" placeholder="Enter Youtube URL" onChange={handleURLChange} />
					<TooltipButton variant="success" type="button" onClick={handleYoutubeSubmit} tooltip="Load video from URL" placement="bottom">
						Load
					</TooltipButton>
					<TooltipButton
						variant="primary"
						style={{ whiteSpace: 'nowrap' }}
						type="button"
						onClick={handleSampleVideo}
						tooltip={sampleVideoIndex === 0 ? 'Load a sample video to try' : 'Load another sample video'}
						placement="bottom"
					>
						{sampleVideoIndex === 0 ? 'Try Sample Video' : 'Try Another Video'}
					</TooltipButton>
				</Form>
			</Container>

			{errorMessage ? <div className="error-msg mb-1">{errorMessage}</div> : <div style={{ height: '25px' }}></div>}

			<div className="video-container mb-4">
				<YouTube videoId={videoCode} opts={opts} onReady={onReady} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
			</div>

			<Timeline
				duration={endTime}
				currentTime={currentTime}
				startTime={loopStartTime}
				endTime={loopEndTime}
				onLoopStartChange={handleLoopStartChange}
				onLoopEndChange={handleLoopEndChange}
				onSeek={handleSeek}
			/>

			<PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} playerRef={player} />
			<ShiftLoopControls
				startMinutes={startMinutes}
				startSeconds={startSeconds}
				setStartMinutes={setStartMinutes}
				setStartSeconds={setStartSeconds}
				endMinutes={endMinutes}
				endSeconds={endSeconds}
				setEndMinutes={setEndMinutes}
				setEndSeconds={setEndSeconds}
				endTime={endTime}
			/>

			<LoopControls
				currentTime={currentTime}
				playerRef={player}
				startMinutes={startMinutes}
				startSeconds={startSeconds}
				setStartMinutes={setStartMinutes}
				setStartSeconds={setStartSeconds}
				endMinutes={endMinutes}
				endSeconds={endSeconds}
				setEndMinutes={setEndMinutes}
				setEndSeconds={setEndSeconds}
				toggleLoop={toggleLoop}
				isLoopedOnce={isLoopedOnce}
				setIsLoopedOnce={setIsLoopedOnce}
				endTime={endTime}
				videoCode={videoCode}
				onToggleLoop={handleToggleLoop}
				onLoopOnce={handleLoopOnce}
				onStopLoopOnce={handleStopLoopOnce}
			/>
			<SpeedControls playerRef={player} onSpeedChange={handleSpeedChange} activeSpeed={playbackSpeed} />
			{/* <Row className="mb-4 justify-content-center" style={{ gap: '40px', flexWrap: 'wrap' }}>
				<Col xs="auto">
					<SpeedControls playerRef={player} onSpeedChange={handleSpeedChange} activeSpeed={playbackSpeed} />
				</Col>
				<Col xs="auto">
					<ShiftLoopControls
						startMinutes={startMinutes}
						startSeconds={startSeconds}
						setStartMinutes={setStartMinutes}
						setStartSeconds={setStartSeconds}
						endMinutes={endMinutes}
						endSeconds={endSeconds}
						setEndMinutes={setEndMinutes}
						setEndSeconds={setEndSeconds}
						endTime={endTime}
					/>
				</Col>
			</Row> */}

			<LoopPresets
				videoCode={videoCode}
				startMinutes={startMinutes}
				startSeconds={startSeconds}
				endMinutes={endMinutes}
				endSeconds={endSeconds}
				speed={playbackSpeed}
				onLoadPreset={handleLoadPreset}
			/>

			<div className="shortcuts-help">
				<strong>Keyboard Shortcuts:</strong>
				<br />
				<kbd>←</kbd> / <kbd>→</kbd> Seek -5s / +5s &nbsp;
				<kbd>{'['}</kbd> / <kbd>{']'}</kbd> Seek -1f / +1f &nbsp;
				<kbd>L</kbd> Toggle loop &nbsp;
				<kbd>1</kbd> Loop once &nbsp;
				<kbd>S</kbd> Set start &nbsp;
				<kbd>E</kbd> Set end
			</div>
		</>
	);
}

export default App;
