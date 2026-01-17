import { useState, useEffect } from 'react';
import { Col, Container, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { secondsToHMS, secondsToHMSTuple, HMSToSeconds } from '../utils/secondsToHMS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
export default function LoopControls({ currentTime, playerRef, toggleLoop, setToggleLoop, endTime }) {
	const [startMinutes, setStartMinutes] = new useState(0);
	const [startSeconds, setStartSeconds] = new useState(0);
	const [endMinutes, setEndMinutes] = new useState(0);
	const [endSeconds, setEndSeconds] = new useState(0);
	const [isLoopedOnce, setIsLoopedOnce] = new useState(false);

	useEffect(() => {
		const t = secondsToHMSTuple(endTime - 1);
		setEndMinutes(t.minutes);
		setEndSeconds(t.seconds);
	}, [endTime]);

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

	function roundToNearest05(n) {
		return Math.round(n / 0.05) * 0.05;
	}

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
			playerRef.current.seekTo(startLoopTime, true);
			playerRef.current.playVideo();
		}
	};

	const handleIsLoopedOnce = () => {
		if (isLoopedOnce) {
			setIsLoopedOnce((prev) => !prev);
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

						{/* START LOOP CONTROLS */}
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
							className="mt-2 mb-3"
							variant={toggleLoop ? 'danger' : 'primary'}
							style={{ maxWidth: '90px' }}
							onClick={handleToggleLoop}
							disabled={isLoopedOnce}
						>
							{toggleLoop ? 'Stop Loop' : 'Start Loop'}
						</Button>
						<Button className="mb-3" variant={'success'} onClick={handleIsLoopedOnce} style={{ maxWidth: '90px' }} disabled={toggleLoop}>
							{isLoopedOnce ? 'Stop Loop' : 'Loop Once'}
						</Button>
					</div>
				</Col>

				{/* END LOOP COLUMN */}
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

						{/* END LOOP CONTROLS */}
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
