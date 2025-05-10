import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import YouTube from 'react-youtube';

export default function YoutubePlayerWrapper({videoId, ref: playerRef}) {
    const internalRef = useRef(null)

    const onReady = (event) => {
        
    }
}