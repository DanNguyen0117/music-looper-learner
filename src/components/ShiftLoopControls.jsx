import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { secondsToHMSTuple, HMSToSeconds, roundToNearest05 } from '../utils/secondsToHMS';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LoopControls.css';

function ShiftLoopControls({
	startMinutes,
	startSeconds,
	setStartMinutes,
	setStartSeconds,
	endMinutes,
	endSeconds,
	setEndMinutes,
	setEndSeconds,
	endTime,
}) {
	const handleLeftShiftLoop = () => {
		const startLoopTotalSeconds = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTotalSeconds = HMSToSeconds(0, endMinutes, endSeconds);
		const loopTime = endLoopTotalSeconds - startLoopTotalSeconds;

		const shiftedStartSec = startLoopTotalSeconds - loopTime;
		const shiftedEndSec = endLoopTotalSeconds - loopTime;

		if (shiftedStartSec < 0 || shiftedEndSec < 0) {
			console.log('cannot shift loop left, loop is as far left as it can be.');
			return;
		}

		const newStartT = secondsToHMSTuple(shiftedStartSec);
		const newEndT = secondsToHMSTuple(shiftedEndSec);

		setStartMinutes(newStartT.minutes);
		setStartSeconds(newStartT.seconds);
		setEndMinutes(newEndT.minutes);
		setEndSeconds(newEndT.seconds);
	};

	const handleRightShiftLoop = () => {
		const startLoopTotalSeconds = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTotalSeconds = HMSToSeconds(0, endMinutes, endSeconds);
		const loopTime = endLoopTotalSeconds - startLoopTotalSeconds;

		const shiftedStartSec = startLoopTotalSeconds + loopTime;
		const shiftedEndSec = endLoopTotalSeconds + loopTime;

		if (shiftedStartSec > endTime || shiftedEndSec > endTime) {
			console.log('cannot shift loop right, loop is as far right as it can be.');
			return;
		}

		const newStartT = secondsToHMSTuple(shiftedStartSec);
		const newEndT = secondsToHMSTuple(shiftedEndSec);

		setStartMinutes(newStartT.minutes);
		setStartSeconds(newStartT.seconds);
		setEndMinutes(newEndT.minutes);
		setEndSeconds(newEndT.seconds);
	};

	const handleHalfLoop = () => {
		const startLoopTotalSeconds = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTotalSeconds = HMSToSeconds(0, endMinutes, endSeconds);
		const loopTime = endLoopTotalSeconds - startLoopTotalSeconds;

		if (loopTime <= 0.05) {
			console.log('cannot half the loop, loop is as small as it gets!');
			return;
		}

		const halfLoop = roundToNearest05(loopTime) / 2;
		let shiftedEndSec = endLoopTotalSeconds - halfLoop;

		if (endLoopTotalSeconds - startLoopTotalSeconds < 0.1) {
			shiftedEndSec = startLoopTotalSeconds + 0.05;
		}

		const newEndT = secondsToHMSTuple(shiftedEndSec);
		setEndMinutes(newEndT.minutes);
		setEndSeconds(newEndT.seconds);
	};

	const handleDoubleLoop = () => {
		const startLoopTotalSeconds = HMSToSeconds(0, startMinutes, startSeconds);
		const endLoopTotalSeconds = HMSToSeconds(0, endMinutes, endSeconds);
		const loopTime = endLoopTotalSeconds - startLoopTotalSeconds;

		const doubleLoop = roundToNearest05(loopTime) * 2;
		const shiftedEndSec = startLoopTotalSeconds + doubleLoop;

		if (shiftedEndSec > endTime) {
			console.log('cannot double the loop length any further');
			return;
		}

		const newEndT = secondsToHMSTuple(shiftedEndSec);
		setEndMinutes(newEndT.minutes);
		setEndSeconds(newEndT.seconds);
	};

	return (
		<>
			<div className="mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
				Move Loop
			</div>
			<Container className="mb-3 d-flex flex-wrap justify-content-center">
				<div className="ms-2">
					<Button onClick={handleLeftShiftLoop}>
						<FontAwesomeIcon icon={faLeftLong} />
					</Button>
					<div className="help-text me-1">Left</div>
				</div>
				<div className="ms-2">
					<Button className="me-1" onClick={handleRightShiftLoop}>
						<FontAwesomeIcon icon={faRightLong} />
					</Button>
					<div className="help-text me-1">Right</div>
				</div>
				<div className="ms-2">
					<Button onClick={handleHalfLoop}>
						1/2x
					</Button>
					<div className="help-text">½ Loop</div>
				</div>
				<div className="ms-2">
					<Button onClick={handleDoubleLoop}>2x</Button>
					<div className="help-text">2x Loop</div>
				</div>
			</Container>
		</>
	);
}

export default ShiftLoopControls;
