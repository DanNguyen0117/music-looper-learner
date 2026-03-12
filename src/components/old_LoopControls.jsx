import { useState, useEffect } from 'react';
import { Col, Container, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { secondsToHMS, secondsToHMSTuple, HMSToSeconds, roundToNearest05 } from '../utils/secondsToHMS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './LoopControls.css';

export default function LoopControls({
	currentTime,
	playerRef,
	toggleLoop,
	setToggleLoop,
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
}) {
	const [isLoopedOnce, setIsLoopedOnce] = useState(false);

	useEffect(() => {
		const t = secondsToHMSTuple(endTime - 1);
		setStartMinutes(0);
		setStartSeconds(0);
		setEndMinutes(t.minutes);
		setEndSeconds(t.seconds);
	}, [videoCode, endTime]);

	useEffect(() => {
		const interval = setInterval(() => {
			const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
			const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
			if (toggleLoop && playerRef.current && startLoopTime <= endLoopTime && playerRef.current.getCurrentTime() >= endLoopTime) {
				console.log('looping');
				playerRef.current.seekTo(startLoopTime, true);
				playerRef.current.playVideo();
			}

			if (isLoopedOnce && playerRef.current.getCurrentTime() >= endLoopTime) {
				console.log('it is pausing');
				playerRef.current.pauseVideo();
				setIsLoopedOnce(false);
			}
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [startMinutes, startSeconds, endMinutes, endSeconds, toggleLoop, isLoopedOnce]);

	const handleStartSetTime = () => {
		const totalSeconds = playerRef.current.getCurrentTime();

		const minutes = Math.floor(totalSeconds / 60);
		const seconds = roundToNearest05(totalSeconds % 60);

		setStartMinutes(minutes);
		setStartSeconds(seconds);
	};

	const handleEndSetTime = () => {
		const totalSeconds = playerRef.current.getCurrentTime();

		const minutes = Math.floor(totalSeconds / 60);
		const seconds = roundToNearest05(totalSeconds % 60);

		setEndMinutes(minutes);
		setEndSeconds(seconds);
	};

	const handleStartMinutes = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setStartMinutes(Number(e.target.value));
			// TODO ARBITRARY experimental
			setEndMinutes(Number(e.target.value));
		}
	};
	const handleStartSeconds = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setStartSeconds(Number(e.target.value));
			// TODO ARBITRARY experimental
			// if (startMinutes >= endMinutes) {
			// 	setEndSeconds(e.target.value);
			// }
		}
	};

	const handleEndMinutes = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setEndMinutes(Number(e.target.value));
		}
	};
	const handleEndSeconds = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setEndSeconds(Number(e.target.value));
		}
	};

	const handleToggleLoop = () => {
		const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
		if (playerRef.current && startLoopTime <= endTime && endLoopTime <= endTime && startLoopTime < endLoopTime) {
			setToggleLoop((prev) => !prev);

			// toggleLoop backwards logic!
			if (toggleLoop) {
				// setToggleLoop would have made toggleLoop FALSE, but due to React state not updating immediately the current bool val for toggleLoop is still TRUE
				// user pressed "Stop Loop" therefore we pause the video and go back to non-loop/normal mode and pause the video
				playerRef.current.pauseVideo();
			} else {
				// user pressed "Start Loop" so we go back to the start of the loop time and play the video
				playerRef.current.seekTo(startLoopTime, true);
				playerRef.current.playVideo();
			}
		}
	};

	const handleIsLoopedOnce = () => {
		if (isLoopedOnce) {
			setIsLoopedOnce((prev) => !prev);
			playerRef.current.pauseVideo();
		} else {
			const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
			const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
			console.log(startLoopTime, endLoopTime);
			if (playerRef.current && startLoopTime <= endTime && endLoopTime <= endTime && startLoopTime < endLoopTime) {
				setIsLoopedOnce(true);
				playerRef.current.seekTo(startLoopTime, true);
				playerRef.current.playVideo();
			}
		}
	};

	const getDecimalOnly = (value) => {
		return '.' + Number(value).toFixed(2).split('.')[1];
	};

	const handleStartAdjust = (str) => {
		switch (str) {
			case '-1s':
				if (startSeconds <= 0 && startMinutes > 0) {
					setStartSeconds(59);
					setStartMinutes((prev) => prev - 1);
				} else if (startSeconds > 0) {
					setStartSeconds((prev) => prev - 1);
				}
				break;
			case '-1f':
				if (startSeconds <= 0.05 && startMinutes > 0) {
					setStartSeconds(59);
					setStartMinutes((prev) => prev - 1);
				}
				if (startSeconds > 0.05) {
					setStartSeconds((prev) => Math.round((prev - 0.05) * 100) / 100);
				}
				break;
			case '+1f':
				if (startSeconds >= 59.95) {
					setStartSeconds(0);
					setStartMinutes((prev) => prev + 1);
				} else {
					setStartSeconds((prev) => Math.round((prev + 0.05) * 100) / 100);
				}
				break;
			case '+1s':
				if (startSeconds >= 59) {
					setStartSeconds(0);
					setStartMinutes((prev) => prev + 1);
				} else {
					setStartSeconds((prev) => prev + 1);
				}
				break;
			default:
				break;
		}
	};

	const handleEndAdjust = (str) => {
		switch (str) {
			case '-1s':
				if (endSeconds <= 0 && endMinutes > 0) {
					setEndSeconds(59);
					setEndMinutes((prev) => prev - 1);
				} else if (endSeconds > 0) {
					setEndSeconds((prev) => prev - 1);
				}
				break;
			case '-1f':
				if (endSeconds <= 0.05 && endMinutes > 0) {
					setEndSeconds(59);
					setEndMinutes((prev) => prev - 1);
				}
				if (endSeconds > 0.05) {
					setEndSeconds((prev) => Math.round((prev - 0.05) * 100) / 100);
				}
				break;
			case '+1f':
				if (endSeconds >= 59.95) {
					setEndSeconds(0);
					setEndMinutes((prev) => prev + 1);
				} else {
					setEndSeconds((prev) => Math.round((prev + 0.05) * 100) / 100);
				}
				break;
			case '+1s':
				if (endSeconds >= 59) {
					setEndSeconds(0);
					setEndMinutes((prev) => prev + 1);
				} else {
					setEndSeconds((prev) => prev + 1);
				}
				break;
			default:
				break;
		}
	};

	return (
		<>
			<Row className="mb-4 justify-content-center" style={{ gap: '40px', flexWrap: 'wrap' }}>
				{/* START LOOP COLUMN */}
				<Col xs="auto">
					<div>
						<div className="mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
							Loop Start
						</div>
						<div className="mb-3 d-flex align-items-center justify-content-center gap-1">
							<div>
								<Form.Control
									type="text"
									value={startMinutes}
									onChange={handleStartMinutes}
									style={{ width: '45px', textAlign: 'right' }}
								/>
								<div className="help-text">min</div>
							</div>
							<div className="mb-4">:</div>
							<div>
								<Form.Control
									type="text"
									value={Math.trunc(startSeconds)}
									onChange={handleStartSeconds}
									style={{ width: '45px', textAlign: 'right' }}
								/>
								<div className="help-text">sec</div>
							</div>
							<div className="mb-3">{getDecimalOnly(startSeconds)}</div>
						</div>

						{/* START CONTROLS */}
						<Container className="mb-3 d-flex flex-wrap justify-content-center">
							<div className="me-2">
								<Button variant="secondary" onClick={() => handleStartAdjust('-1f')}>
									<FontAwesomeIcon icon={faAngleLeft} />
								</Button>
								<div className="help-text">-1f</div>
							</div>
							<div className="me-2">
								<Button variant="success" onClick={handleStartSetTime}>
									{secondsToHMS(currentTime)}
								</Button>
								<div className="help-text">Set Time</div>
							</div>
							<div className="me-1">
								<Button variant="secondary" onClick={() => handleStartAdjust('+1f')}>
									<FontAwesomeIcon icon={faAngleRight} />
								</Button>
								<div className="help-text">+1f</div>
							</div>
						</Container>
					</div>
				</Col>

				{/* LOOP CONTROLS */}
				<Col xs="auto">
					<div className="d-flex flex-column">
						<Button
							className={`mt-2 mb-3 btn-pushable`}
							variant={toggleLoop ? 'danger' : 'primary'}
							style={{ maxWidth: '90px' }}
							onClick={handleToggleLoop}
							disabled={isLoopedOnce}
							onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
							onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
							onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
						>
							<span className="btn-front">{toggleLoop ? 'Stop Loop' : 'Start Loop'}</span>
						</Button>

						<Button
							className="mb-3 btn-pushable"
							variant="success"
							style={{ maxWidth: '90px' }}
							onClick={handleIsLoopedOnce}
							disabled={toggleLoop}
							onMouseDown={(e) => e.currentTarget.classList.add('is-pressed')}
							onMouseUp={(e) => e.currentTarget.classList.remove('is-pressed')}
							onMouseLeave={(e) => e.currentTarget.classList.remove('is-pressed')}
						>
							<span className="btn-front">{isLoopedOnce ? 'Stop Loop' : 'Loop Once'}</span>
						</Button>
					</div>
				</Col>

				{/* END AREA COLUMN */}
				<Col xs="auto">
					<div>
						<div className="mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
							Loop End
						</div>
						<div className="mb-3 d-flex align-items-center justify-content-center gap-1">
							<div>
								<Form.Control type="text" value={endMinutes} onChange={handleEndMinutes} style={{ width: '45px', textAlign: 'right' }} />
								<div className="help-text">min</div>
							</div>
							<div className="mb-4">:</div>
							<div>
								<Form.Control
									type="text"
									value={Math.trunc(endSeconds)}
									onChange={handleEndSeconds}
									style={{ width: '45px', textAlign: 'right' }}
								/>
								<div className="help-text">sec</div>
							</div>
							<div className="mb-3">{getDecimalOnly(endSeconds)}</div>
						</div>

						{/* END CONTROLS */}
						<Container className="mb-3 d-flex flex-wrap justify-content-center">
							<div className="ms-1">
								<Button variant="secondary" onClick={() => handleEndAdjust('-1f')}>
									<FontAwesomeIcon icon={faAngleLeft} />
								</Button>
								<div className="help-text">-1f</div>
							</div>
							<div className="ms-2">
								<Button variant="success" onClick={handleEndSetTime}>
									{secondsToHMS(currentTime)}
								</Button>
								<div className="help-text">Set Time</div>
							</div>
							<div className="ms-2">
								<Button variant="secondary" onClick={() => handleEndAdjust('+1f')}>
									<FontAwesomeIcon icon={faAngleRight} />
								</Button>
								<div className="help-text">+1f</div>
							</div>
						</Container>
					</div>
				</Col>
			</Row>
		</>
	);
}
