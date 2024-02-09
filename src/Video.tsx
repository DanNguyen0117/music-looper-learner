import { useState, useEffect} from 'react'
import Youtube, { YouTubeProps } from 'react-youtube'
import Slider, { SliderProps } from 'rc-slider'
import './Video.css'
import 'rc-slider/assets/index.css';

function secondsToHMS(seconds: number) {
    const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
    const minutes = hours ? Math.floor((seconds % 3600) / 60): Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

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
    const [sliderValues, setSliderValues] = useState([0,100])
    const [displayTime, setDisplayTime] = useState('hi')
    
    useEffect(() => {
        updateStartEndDisplayTimes(startTime, endTime)
    }, [startTime, endTime])

    const updateStartEndDisplayTimes = (start: number, end: number) => {
        setStartTime(start)
        setEndTime(end)
        handleDisplayTime()
    }

    const handleDisplayTime = () => {
        const displayStartTime = secondsToHMS(startTime)
        const displayEndTime = secondsToHMS(endTime)
        setDisplayTime(String(displayStartTime) + ' - ' + String(displayEndTime))
    }

    /**
     * 
     * SLIDER FUNCTIONS
     */
    const handleSliderValues = (e: number | number[]) => {
        const values: number[] = Array.isArray(e) ? e : [e]
        setSliderValues(values)
        console.log(values)
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

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (e) => {
        const duration = e.target.getDuration()
        console.log("state change", duration)
        updateStartEndDisplayTimes(0, duration)
        setSliderValues([startTime, endTime])
    }

    const onPlayerReady: YouTubeProps['onReady'] = (e) => {
        console.log("onplayerready")
        // access to player in all event handlers via event.target
        e.target.pauseVideo()
        const duration = e.target.getDuration()
        console.log("ready:", duration)
        updateStartEndDisplayTimes(0, duration)
        setSliderValues([startTime, endTime])
    }

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '670',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className='wrapper'>
            <h1 className='form-group title' style={{ marginBottom: '20px' }}>Music Looper Learner</h1>
            <form className='form-group form' onSubmit={handleYoutubeSubmit}>
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
            <>
                <Youtube
                    style={{ marginBottom: '10px' }}
                    videoId={videoCode}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                />
                <div className='slider-container'>
                    <Slider 
                        range 
                        min={startTime}
                        max={endTime || 100}
                        defaultValue={sliderValues}
                        value={sliderValues}
                        allowCross={false}
                        onChange={handleSliderValues}
                    />
                    <div>{displayTime}</div>
                </div>
            </>
                : <div>Video will appear once URL is uploaded</div>}           
        </div>
    )
}