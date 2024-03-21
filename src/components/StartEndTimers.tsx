type timerProps = {
    sliderValues: number[]
}

export default function StartEndTimers(sliderValues: timerProps) {
    return (
        <div>
            <div className="input-group mb-3">
                <button className="btn btn-outline-secondary" type="button">Button</button>
                <input type="text" className="form-control" placeholder="" aria-label="Example text with two button addons" />
                <button className="btn btn-outline-secondary" type="button">Button</button>
            </div>
        </div>
    )
}