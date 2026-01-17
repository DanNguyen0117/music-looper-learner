import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from 'react';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ShiftLoopControls() {
	return (
		<>
			<div className="mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
				Shift Loop
			</div>
            <Button className='me-1'>
                <FontAwesomeIcon icon={faLeftLong} />
            </Button>
            <Button>
                <FontAwesomeIcon icon={faRightLong} />
            </Button>
		</>
	);
}

export default ShiftLoopControls;
