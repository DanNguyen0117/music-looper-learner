import { useEffect } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { secondsToHMS, secondsToHMSTuple, HMSToSeconds, roundToNearest05 } from '../utils/secondsToHMS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import './LoopControls.css';

// ─── Shared sub-component for Loop Start / Loop End columns ───────────────────
function TimeColumn({ label, minutes, seconds, setMinutes, setSeconds, currentTime, onSetTime, onAdjust }) {
	const getDecimalOnly = (value) => '.' + Number(value).toFixed(2).split('.')[1];

	const handleMinutes = (e) => {
		const val = e.target.value;
		if (!isNaN(val) && String(val).length <= 2 && val < 60) setMinutes(Number(val));
	};

	const handleSeconds = (e) => {
		const val = e.target.value;
		if (!isNaN(val) && String(val).length <= 2 && val < 60) setSeconds(Number(val));
	};

	return (
		<Col xs="auto">
			<div className="mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>{label}</div>

			<div className="mb-3 d-flex align-items-center justify-content-center gap-1">
				<div>
					<Form.Control type="text" value={minutes} onChange={handleMinutes} style={{ width: '45px', textAlign: 'right' }} />
					<div className="help-text">min</div>
				</div>
				<div className="mb-4">:</div>
				<div>
					<Form.Control type="text" value={Math.trunc(seconds)} onChange={handleSeconds} style={{ width: '45px', textAlign: 'right' }} />
					<div className="help-text">sec</div>
				</div>
				<div className="mb-3">{getDecimalOnly(seconds)}</div>
			</div>

			<Container className="mb-3 d-flex flex-wrap justify-content-center gap-2">
				<div>
					<Button variant="secondary" onClick={() => onAdjust('-1s')}><FontAwesomeIcon icon={faAnglesLeft} /></Button>
					<div className="help-text">-1s</div>
				</div>
				<div>
					<Button variant="secondary" onClick={() => onAdjust('-1f')}><FontAwesomeIcon icon={faAngleLeft} /></Button>
					<div className="help-text">-1f</div>
				</div>
				<div>
					<Button variant="success" onClick={onSetTime}>{secondsToHMS(currentTime)}</Button>
					<div className="help-text">Set Time</div>
				</div>
				<div>
					<Button variant="secondary" onClick={() => onAdjust('+1f')}><FontAwesomeIcon icon={faAngleRight} /></Button>
					<div className="help-text">+1f</div>
				</div>
				<div>
					<Button variant="secondary" onClick={() => onAdjust('+1s')}><FontAwesomeIcon icon={faAnglesRight} /></Button>
					<div className="help-text">+1s</div>
				</div>
			</Container>
		</Col>
	);
}

// ─── Shared adjust handler factory ────────────────────────────────────────────
function makeAdjustHandler(minutes, setMinutes, seconds, setSeconds) {
	return (dir) => {
		switch (dir) {
			case '-1s':
				if (seconds <= 0 && minutes > 0) { setSeconds(59); setMinutes((p) => p - 1); }
				else if (seconds > 0) setSeconds((p) => p - 1);
				break;
			case '-1f':
				if (seconds <= 0.05 && minutes > 0) { setSeconds(59); setMinutes((p) => p - 1); }
				else if (seconds > 0.05) setSeconds((p) => Math.round((p - 0.05) * 100) / 100);
				break;
			case '+1f':
				if (seconds >= 59.95) { setSeconds(0); setMinutes((p) => p + 1); }
				else setSeconds((p) => Math.round((p + 0.05) * 100) / 100);
				break;
			case '+1s':
				if (seconds >= 59) { setSeconds(0); setMinutes((p) => p + 1); }
				else setSeconds((p) => p + 1);
				break;
			default:
				break;
		}
	};
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoopControls({
	currentTime,
	playerRef,
	toggleLoop,
	isLoopedOnce,
	setIsLoopedOnce,
	endTime,
	videoCode,
	startMinutes,
	startSeconds,
	setStartMinutes,
	setStartSeconds,
	endMinutes,
	endSeconds,
	setEndMinutes,
	setEndSeconds,
	onToggleLoop,
	onLoopOnce,
	onStopLoopOnce,
}) {

	// Reset loop bounds whenever the video changes
	useEffect(() => {
		const t = secondsToHMSTuple(endTime - 1);
		setStartMinutes(0);
		setStartSeconds(0);
		setEndMinutes(t.minutes);
		setEndSeconds(t.seconds);
	}, [videoCode, endTime]);

	// Looping interval
	useEffect(() => {
		const interval = setInterval(() => {
			const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
			const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
			if (!playerRef.current || startLoopTime >= endLoopTime) return;

			const currentPlayerTime = playerRef.current.getCurrentTime();

			if (toggleLoop && currentPlayerTime >= endLoopTime) {
				playerRef.current.seekTo(startLoopTime, true);
				playerRef.current.playVideo();
			}

			if (isLoopedOnce && currentPlayerTime >= endLoopTime) {
				playerRef.current.pauseVideo();
				setIsLoopedOnce(false);
			}
		}, 50);

		return () => clearInterval(interval);
	}, [startMinutes, startSeconds, endMinutes, endSeconds, toggleLoop, isLoopedOnce, setIsLoopedOnce]);

	// ── Shared set-time-from-player handler ─────────────────────────────────
	const makeSetTimeHandler = (setMin, setSec) => () => {
		const total = playerRef.current.getCurrentTime();
		setMin(Math.floor(total / 60));
		setSec(roundToNearest05(total % 60));
	};

	// ── Loop-once toggle ─────────────────────────────────────────────────────
	const handleIsLoopedOnce = () => {
		if (isLoopedOnce) {
			onStopLoopOnce();
		} else {
			onLoopOnce();
		}
	};

	// ── Pushable button helpers ──────────────────────────────────────────────
	const pushableProps = {
		onMouseDown: (e) => e.currentTarget.classList.add('is-pressed'),
		onMouseUp:   (e) => e.currentTarget.classList.remove('is-pressed'),
		onMouseLeave:(e) => e.currentTarget.classList.remove('is-pressed'),
	};

	return (
		<Row className="mb-4 justify-content-center" style={{ gap: '40px', flexWrap: 'wrap' }}>

			<TimeColumn
				label="Loop Start"
				minutes={startMinutes}
				seconds={startSeconds}
				setMinutes={setStartMinutes}
				setSeconds={setStartSeconds}
				currentTime={currentTime}
				onSetTime={makeSetTimeHandler(setStartMinutes, setStartSeconds)}
				onAdjust={makeAdjustHandler(startMinutes, setStartMinutes, startSeconds, setStartSeconds)}
			/>

			{/* Center controls */}
			<Col xs="auto" className="d-flex flex-column">
				<Button
					className="mt-2 mb-3 btn-pushable"
					variant={toggleLoop ? 'danger' : 'primary'}
					style={{ maxWidth: '90px' }}
					onClick={onToggleLoop}
					disabled={isLoopedOnce}
					{...pushableProps}
				>
					<span className="btn-front">{toggleLoop ? 'Stop Loop' : 'Start Loop'}</span>
				</Button>

				<Button
					className="mb-3 btn-pushable"
					variant="success"
					style={{ maxWidth: '90px' }}
					onClick={handleIsLoopedOnce}
					disabled={toggleLoop}
					{...pushableProps}
				>
					<span className="btn-front">{isLoopedOnce ? 'Stop Loop' : 'Loop Once'}</span>
				</Button>
			</Col>

			<TimeColumn
				label="Loop End"
				minutes={endMinutes}
				seconds={endSeconds}
				setMinutes={setEndMinutes}
				setSeconds={setEndSeconds}
				currentTime={currentTime}
				onSetTime={makeSetTimeHandler(setEndMinutes, setEndSeconds)}
				onAdjust={makeAdjustHandler(endMinutes, setEndMinutes, endSeconds, setEndSeconds)}
			/>

		</Row>
	);
}