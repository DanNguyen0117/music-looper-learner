import { useState, useEffect} from 'react'
import Youtube, { YouTubeProps } from 'react-youtube'
import Slider, { SliderProps } from 'rc-slider'
import ReactSlider from 'react-slider'
import './Video.css'
import 'rc-slider/assets/index.css';

function secondsToHMS(seconds: number) {
    const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
    const minutes = hours ? Math.floor((seconds % 3600) / 60): Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the result
    const formattedTime = (hours ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;

    return formattedTime;
}

export default function Video() {
    const [videoURL, setVideoURL] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [videoCode, setVideoCode] = useState('')
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [sliderValues, setSliderValues] = useState([0,0])
    const [displayTime, setDisplayTime] = useState('')

    const handleDisplayTime = () => {
        const displayStartTime = secondsToHMS(startTime)
        const displayEndTime = secondsToHMS(endTime)
        setDisplayTime(String(displayStartTime) + ' - ' + String(displayEndTime))
    }

    const handleVideoTimes: SliderProps['onChange'] = (e) => {
        console.log(e.valueOf(), e.toString(), e.toLocaleString())
    }

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoURL(e.target.value)
        setErrorMessage('')
    }

    const handleYoutubeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/
        if (youtubeRegex.test(videoURL)) {
            let code = videoURL.split("v=")[1].split("&")[0];
            setVideoCode(code)
            setErrorMessage('')
        } else {
            setErrorMessage('Invalid Youtube URL')
        }
    }

    const onPlayerReady: YouTubeProps['onReady'] = (e) => {
        console.log("onplayerready")
        // access to player in all event handlers via event.target
        e.target.pauseVideo()
        const duration = e.target.getDuration()
        setStartTime(() => 0)
        setEndTime(() => duration)
        handleDisplayTime()
        console.log(startTime)
        console.log(secondsToHMS(endTime))
    }

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    return (
        <div className='wrapper'>
            <h1 className='form-group title' style={{ marginBottom: '20px' }}>Music Looper Learner</h1>
            <form className='form-group form' onSubmit={e => handleYoutubeSubmit(e)}>
                <input
                    className='form-control'
                    type='text'
                    style={{ marginRight: '10px' }}
                    value={videoURL}
                    placeholder='Enter YouTube URL'
                    onChange={e => handleURLChange(e)}
                />
                <button type='submit' className='btn btn-success btn-md'>
                    Upload
                </button>
            </form>
            {errorMessage && <div className='error-msg'>{errorMessage}</div>}
            <br></br>
            {videoCode ? 
            <Youtube
                style={{ marginBottom: '10px' }}
                videoId={videoCode}
                opts={opts}
                onReady={onPlayerReady}
            />
                : <div>Video will appear once URL is uploaded</div>}

            {/* <div className='loop-slider-container'>
                <div className='slide-track'></div>
                    <input type='range' min={startTime} max={endTime} defaultValue={startTime} />
                    <input type='range' min={startTime} max={endTime} defaultValue={endTime} />
                <br></br>
                <div>{displayTime}</div>
            </div> */}
            <div className='slider-container'>
                {/* <Slider range defaultValue={[0,100]} allowCross={false}/> */}
                <Slider 
                    range 
                    min={startTime}
                    max={endTime || 100}
                    defaultValue={sliderValues}
                    allowCross={false}
                    onChange={handleVideoTimes}
                />
                <div>{displayTime}</div>
                <br></br>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                    defaultValue={[0, 100]}
                    ariaLabel={['Lower thumb', 'Upper thumb']}
                    ariaValuetext={state => `Thumb value ${state.valueNow}`}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    pearling
                    minDistance={10}
                />
            </div>
        </div>
    )
}