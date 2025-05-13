import { useEffect, useRef, useState } from 'react';
import PlaybackControls from './components/PlaybackControls';
import LoopControls from './components/LoopControls';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import './App.css';
import { secondsToHMS } from './utils/secondsToHMS';
import YouTube from 'react-youtube';

/**
 * Sample video urls:
 * All the Things You Are - Chet Baker.   https://www.youtube.com/watch?v=ngFdSR_aqdI
 * Clair De Lune - Debussy (Rousseau).    https://www.youtube.com/watch?v=WNcsUNKlAKw
 * My Favourite Things  - McCoy Tyner.    https://www.youtube.com/watch?v=aeB43h2SiTM
 * Waltz For Debby - Bill Evans.          https://www.youtube.com/watch?v=QBzHqW4V3lA
 * https://www.youtube.com/watch?v=5Iv3Fi8eb7w
 */
const sampleVideos = ['5Iv3Fi8eb7w', 'ngFdSR_aqdI', 'WNcsUNKlAKw', 'aeB43h2SiTM', 'wCINvavqFXk'];

function App() {
	const [videoURL, setVideoURL] = useState('');
	const [videoCode, setVideoCode] = useState(sampleVideos[0]);
	const [startTime, setStartTime] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [sliderValues, setSliderValues] = useState([0, 0]);
	const [sampleVideoIndex, setSampleVideoIndex] = useState(0);
	const [toggleLoop, setToggleLoop] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	let player = useRef(null);
	const VIDEO_K = 22;

	useEffect(() => {
		const interval = setInterval(() => {
			const current = player.current?.getCurrentTime();
			setCurrentTime(current);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	/**
	 * handler functions
	 */

	const handleURLChange = (e) => {
		e.preventDefault();
		setVideoURL(e.target.value);
		setErrorMessage('');
	};

	const handleYoutubeSubmit = (event) => {
		event.preventDefault();
		const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
		if (youtubeRegex.test(videoURL)) {
			const code = videoURL.split('v=')[1].split('&')[0];
			setVideoCode(code);
			setErrorMessage('');
		} else {
			setErrorMessage('Invalid YouTube URL');
		}
	};

	const handleSampleVideo = () => {
		const index = sampleVideoIndex === sampleVideos.length - 1 ? 0 : sampleVideoIndex + 1;
		setVideoCode(sampleVideos[index]);
		setSampleVideoIndex(index);
		setErrorMessage('');
	};

	const handlePlaybackAction = () => {
		console.log('hi');
	};

	// }
	const onReady = (event) => {
		// access to player in all event handlers via event.target
		setIsPlaying(true);
		// event.target.pauseVideo();
		player.current = event.target;
		setStartTime(0);
		setEndTime(event.target.getDuration() - 1); // ARBITRARY!!! since most videos are 1s behind this can be a more accurate change
		setSliderValues([0, event.target.getDuration()]);
	};

	const opts = {
		height: String(10 * VIDEO_K),
		width: String(40 * VIDEO_K),
		playerVars: {
			autoplay: 1,
			iv_load_policy: 3,
		},
	};

	return (
		<>
			<h1 className="mb-4">Music Looper Learner!</h1>
			<Container style={{ maxWidth: '800px' }} className="mb-2">
				<Form className="d-flex gap-3 align-items-center">
					<Form.Control style={{ flexGrow: 1 }} size="normal" type="text" placeholder="Enter Youtube URL" onChange={handleURLChange} />
					<Button variant="success" type="button" onClick={handleYoutubeSubmit}>
						Upload
					</Button>
					<Button variant="primary" style={{ whiteSpace: 'nowrap' }} type="button" onClick={handleSampleVideo}>
						{sampleVideoIndex === 0 ? 'Try Sample Video' : 'Try Another Video'}
					</Button>
				</Form>
			</Container>

			{errorMessage ? <div className="error-msg mb-1">{errorMessage}</div> : <div style={{ height: '25px' }}></div>}

			<div className="mb-4">
				<YouTube videoId={videoCode} opts={opts} onReady={onReady} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
			</div>

			<PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} playerRef={player} />

			<LoopControls
				startTime={startTime}
				setStartTime={setStartTime}
				currentTime={currentTime}
				playerRef={player}
				toggleLoop={toggleLoop}
				setToggleLoop={setToggleLoop}
			/>
		</>
	);
}

export default App;
