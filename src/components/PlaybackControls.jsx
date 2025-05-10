import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faInfinity, faForward, faForwardFast, faPause, faBackward, faBackwardFast, faAngleRight, faAnglesRight, faAngleLeft, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

const buttons = [
    { icon: faBackwardFast, label: '-5s', id: 'rewind-5' },
    { icon: faBackward, label: '-3s', id: 'rewind-3' },
    { icon: faAnglesLeft, label: '-1s', id: 'rewind-1' },
    { icon: faAngleLeft, label: '-1f', id: 'rewind-frame' },
    { icon: faPlay, label: 'Play', id: 'play' },
    { icon: faPause, label: 'Pause', id: 'pause'},
    { icon: faAngleRight, label: '+1f', id: 'forward-frame' },
    { icon: faAnglesRight, label: '+1s', id: 'forward-1' },
    { icon: faForward, label: '+3s', id: 'forward-3' },
    { icon: faForwardFast, label: '+5s', id: 'forward-5' },
]

function PlaybackControls() {
    return (
        <Container className='mb-4 d-flex flex-wrap justify-content-center'>
            {buttons.map(({icon, label, id}) => (
                <div className='text-center me-3' key={id}>
                    <Button className='playback'>
                        <FontAwesomeIcon icon={icon}/>
                    </Button>
                    <div className='help-text'>{label}</div>
                </div>
            ))}
        </Container>
    )
}

export default PlaybackControls