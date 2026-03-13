import { useEffect } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { secondsToHMS, secondsToHMSTuple, HMSToSeconds, roundToNearest05 } from '../utils/secondsToHMS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import TooltipButton from './TooltipButton';
import './LoopControls.css';

function formatTimeDecimal(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
}

function ActionButton({ variant, onClick, disabled, children, tooltip }) {
  const pushableProps = {
    onMouseDown: (e) => e.currentTarget.classList.add('is-pressed'),
    onMouseUp: (e) => e.currentTarget.classList.remove('is-pressed'),
    onMouseLeave: (e) => e.currentTarget.classList.remove('is-pressed'),
    onTouchStart: (e) => e.currentTarget.classList.add('is-pressed'),
    onTouchEnd: (e) => e.currentTarget.classList.remove('is-pressed'),
  };

  return (
    <TooltipButton
      className="btn-pushable"
      variant={variant}
      style={{ minWidth: '120px' }}
      onClick={onClick}
      disabled={disabled}
      tooltip={tooltip}
      {...pushableProps}
    >
      <span className="btn-front">{children}</span>
    </TooltipButton>
  );
}

// ─── Shared sub-component for Loop Start / Loop End columns ───────────────────
function TimeColumn({ label, minutes, seconds, setMinutes, setSeconds, currentTime, onSetTime, onAdjust, loopDuration, isStart }) {
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
			<div className="time-column-group">
				<div className="mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>{label}</div>

				<div className="time-display mb-2" style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: '600' }}>
					{isStart ? (
						<>
							<span>Current: {formatTimeDecimal(currentTime)}</span>
						</>
					) : (
						<>
							<span>Loop Duration: {formatTimeDecimal(loopDuration)}</span>
						</>
					)}
				</div>

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
					<TooltipButton variant="secondary" onClick={() => onAdjust('-1s')} tooltip="Decrease by 1 second"><FontAwesomeIcon icon={faAnglesLeft} /></TooltipButton>
					<div className="help-text">-1s</div>
				</div>
				<div>
					<TooltipButton variant="secondary" onClick={() => onAdjust('-1f')} tooltip="Decrease by 1 frame"><FontAwesomeIcon icon={faAngleLeft} /></TooltipButton>
					<div className="help-text">-1f</div>
				</div>
				<div>
					<TooltipButton variant="success" onClick={onSetTime} tooltip="Set to current video time">{secondsToHMS(currentTime)}</TooltipButton>
					<div className="help-text">Set Time</div>
				</div>
				<div>
					<TooltipButton variant="secondary" onClick={() => onAdjust('+1f')} tooltip="Increase by 1 frame"><FontAwesomeIcon icon={faAngleRight} /></TooltipButton>
					<div className="help-text">+1f</div>
				</div>
				<div>
					<TooltipButton variant="secondary" onClick={() => onAdjust('+1s')} tooltip="Increase by 1 second"><FontAwesomeIcon icon={faAnglesRight} /></TooltipButton>
					<div className="help-text">+1s</div>
				</div>
			</Container>
			</div>
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
	}, [videoCode, endTime, setStartMinutes, setStartSeconds, setEndMinutes, setEndSeconds]);

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
	}, [startMinutes, startSeconds, endMinutes, endSeconds, toggleLoop, isLoopedOnce, setIsLoopedOnce, playerRef]);

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

	const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
	const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
	const loopDuration = Math.max(0, endLoopTime - startLoopTime);

	return (
		<div className="loop-controls">
			<Row className="mt-5 mb-4 justify-content-center">
				<Col xs="auto">
					<ActionButton
						variant={toggleLoop ? 'danger' : 'primary'}
						onClick={onToggleLoop}
						disabled={isLoopedOnce}
						tooltip={toggleLoop ? "Stop continuous looping" : "Start continuous looping"}
					>
						{toggleLoop ? 'Stop Loop' : 'Start Loop'}
					</ActionButton>
				</Col>
				<Col xs="auto">
					<ActionButton
						variant="success"
						onClick={handleIsLoopedOnce}
						disabled={toggleLoop}
						tooltip={"Play one full loop then stop"}
					>
						{isLoopedOnce ? 'Stop Loop' : 'Loop Once'}
					</ActionButton>
				</Col>
			</Row>
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
					loopDuration={loopDuration}
					isStart={true}
				/>

				<TimeColumn
					label="Loop End"
					minutes={endMinutes}
					seconds={endSeconds}
					setMinutes={setEndMinutes}
					setSeconds={setEndSeconds}
					currentTime={currentTime}
					onSetTime={makeSetTimeHandler(setEndMinutes, setEndSeconds)}
					onAdjust={makeAdjustHandler(endMinutes, setEndMinutes, endSeconds, setEndSeconds)}
					loopDuration={loopDuration}
					isStart={false}
				/>
			</Row>
		</div>
	);
}