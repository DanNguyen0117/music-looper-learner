import { useState } from 'react'
import PlaybackControls from './components/PlaybackControls'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faInfinity, faForward, faForwardFast, faPause, faBackward, faBackwardFast, faAngleRight, faAnglesRight, faAngleLeft, faAnglesLeft} from '@fortawesome/free-solid-svg-icons'


import './App.css'
import YouTube from 'react-youtube'

function secondsToHMS(seconds) {
  const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
  const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)

  // Format the result
  const formattedTime = (hours ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds

  return formattedTime
}

/**
 * Sample video urls:
 * Clair De Lune - Debussy (Rousseau). https://www.youtube.com/watch?v=WNcsUNKlAKw
 * My Favourite Things  - McCoy Tyner. https://www.youtube.com/watch?v=aeB43h2SiTM
 * piano jazz improvisation. https://www.youtube.com/watch?v=QBzHqW4V3lA
 */
const sampleVideos = [
  "WNcsUNKlAKw",
  "aeB43h2SiTM",
  "wCINvavqFXk",
]

function App() {
  const [videoURL, setVideoURL] = useState('')
  const [videoCode, setVideoCode] = useState('ngFdSR_aqdI') //All the Things You Are - Chet Baker

  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  // const [sliderValues, setSliderValues] = useState([0, 100])

  const [sampleVideoIndex, setSampleVideoIndex] = useState(0)

  const [toggleLoop, setToggleLoop] = useState(true)
  
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * handler functions
   */
  
  const handleURLChange = (e) => {
    e.preventDefault()
    setVideoURL(e.target.value)
    setErrorMessage('')
  }

  const handleYoutubeSubmit = (event) => {
    event.preventDefault()
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/
    if (youtubeRegex.test(videoURL)) {
      const code = videoURL.split("v=")[1].split("&")[0]
      setVideoCode(code)
      setErrorMessage('')
    } else {
      setErrorMessage('Invalid Youtube URL')
    }
  }

  const handleSampleVideo = () => {
    setVideoCode(sampleVideos[sampleVideoIndex])
    setSampleVideoIndex(index => index == sampleVideos.length - 1 ? 0 : index + 1)
    setErrorMessage('')
  }

  const handlePlaybackAction = () => {
    console.log('hi')
  }
  // const handlePlaybackAction = (actionId) => {
  //   switch (actionId) {
  //     /**
  //      * { icon: faBackwardFast, label: '-5s', id: 'rewind-5' },
  //   { icon: faBackward, label: '-3s', id: 'rewind-3' },
  //   { icon: faAnglesLeft, label: '-1s', id: 'rewind-1' },
  //   { icon: faAngleLeft, label: '-1f', id: 'rewind-frame' },
  //   { icon: faPlay, label: 'Play', id: 'play' },
  //   { icon: faPause, label: 'Pause', id: 'pause'}
  //   { icon: faAngleRight, label: '+1f', id: 'forward-frame' },
  //   { icon: faAnglesRight, label: '+1s', id: 'forward-1' },
  //   { icon: faForward, label: '+3s', id: 'forward-3' },
  //   { icon: faForwardFast, label: '+5s', id: 'forward-5' },
  //      */
  //   }

  // }
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  const opts = {
    height: '273',
    width: '448',
    playerVars: {
      autoplay: 1,
    },

  }

  return (
    <>
      <h1 className='title mb-4'>Music Looper Learner</h1>
      <Container style={{ maxWidth: '600px' }} className="mb-4">
        <Form className='mb-4'>
          <Form.Control style={{width: '100%'}} className='mb-3' size="lg" type="text" placeholder="Enter Youtube URL" onChange={handleURLChange}/>
          <Button className='me-4' variant='success' type='button' onClick={handleYoutubeSubmit}>Upload</Button>
          <Button variant='primary' type='button' onClick={handleSampleVideo}>{videoCode === 'ngFdSR_aqdI' ? "Try Sample Video" : "Try Another Video"}</Button>
        </Form>
      </Container>
      {errorMessage ? <div className='error-msg mb-1'>{errorMessage}</div> : <div style={{ height: '25px' }}></div>}
      <div className='mb-4'>
        <YouTube videoId={videoCode} opts={opts} onReady={onPlayerReady} />
      </div>

      {/* Playback buttons */}
      <PlaybackControls />
      
      <p className="read-the-docs mb-4">
        Click on the Vite and React logos to learn morea sdf;ksajdf;l kajs;lfksajd;lfasjdl;fksdajf;lk asldk fjl;aksj fl;skdaj fl;askdj f;lsakf jsa;ldkf jas;ldk fjsad;lkf jsad;lf ksaj;l fksajdlf;k djflsdjflks djal; kfsa;ldfk js;aldfkj
      </p>
    </>
  )
}

export default App
