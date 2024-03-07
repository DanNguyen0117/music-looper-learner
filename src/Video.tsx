import { useState, useEffect, useRef} from 'react'
import Youtube, { YouTubeProps, YouTubePlayer } from 'react-youtube'
import Slider, { SliderProps } from 'rc-slider'
import './Video.css'
import 'rc-slider/assets/index.css'

function secondsToHMS(seconds: number) {
    const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
    const minutes = hours ? Math.floor((seconds % 3600) / 60): Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)

    // Format the result
    const formattedTime = (hours ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds

    return formattedTime
}

export default function Video() {
    const [videoURL, setVideoURL] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [videoCode, setVideoCode] = useState('')
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [sliderValues, setSliderValues] = useState([0,100])

    const player = useRef<YouTubePlayer>()
    
    /**
     * Loop methods
     * 
     */
    useEffect(() => {
        const interval = setInterval(() => {
            if (player.current && player.current.getCurrentTime() >= sliderValues[1]) {
                console.log("looping!")
                player.current.seekTo(sliderValues[0], true)
                player.current.playVideo()
            }
        }, 100)

        return () => {
            clearInterval(interval)
        }
    }, [sliderValues])

    /**
     * Slider methods
     * 
     */

    const handleSeekAhead = (times: number | number[]) => {
        times = Array.isArray(times) ? times : [times]
        player.current.seekTo(times[0], true)
        player.current.playVideo()
    }

    const handleSliderValues = (times: number | number[]) => {
        times = Array.isArray(times) ? times : [times]
        setSliderValues(times)
        player.current.seekTo(times[0], false)

        console.log("handleSliderValues (nostate): ", times)
    }

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoURL(e.target.value)
        setErrorMessage('')
    }

    /**
     * Upload button handle
     * 
     */
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

    /**
     * React-Youtube player handles
     * 
     */
    // const onStateChange: YouTubeProps['onStateChange'] = () => {
    //     console.log("state change", startTime, endTime)
    //     updateStartEndDisplayTimes(startTime, endTime)
    //     setSliderValues([startTime, endTime])
    // }

    const onReady: YouTubeProps['onReady'] = (e) => {
        console.log("onready")
        // access to player in all event handlers via event.target

        player.current = e.target
        e.target.pauseVideo()
        setStartTime(0)
        setEndTime(e.target.getDuration())
        setSliderValues([0, e.target.getDuration()])
    }

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '670',
        playerVars: {
            autoplay: 1,
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
                    onReady={onReady}
                    // onStateChange={onStateChange}
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
                        onChangeComplete={handleSeekAhead}
                    />
                    <div>{secondsToHMS(sliderValues[0])} - {secondsToHMS(sliderValues[1])} </div>
                    <div>{secondsToHMS(startTime)} :: {secondsToHMS(endTime)}</div>
                </div>
            </>
                : <div>Video will appear once URL is uploaded</div>}           
        </div>
    )
}