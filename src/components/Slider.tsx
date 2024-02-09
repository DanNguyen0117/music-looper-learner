import React from 'react'
import ReactSlider, { SliderProps } from 'rc-slider'

type Props = {
    min: number
    max: number
    defaultValue: number[]
    value: number[]
    handleSliderValues: (values: number | number[]) => void
}

export default function Slider({min, max, defaultValue, value, handleSliderValues}: Props) {
    return(
        <ReactSlider 
            range
            min={min}
            max={max || 100}
            defaultValue={defaultValue}
            value={value}
            allowCross={false}
            onChange={handleSliderValues}
        />
    )
}