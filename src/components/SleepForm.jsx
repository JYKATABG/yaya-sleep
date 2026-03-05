import "../styles/SleepForm.css"

export const SleepForm = () => {
    return (
        <form className="sleep-form">
            <div className="input-field">
                <label htmlFor="start-time">Bedtime</label>
                <input type="time" id="start-time" className="time-input" />
            </div>
            <div className="input-field">
                <label htmlFor="end-time">Wake up</label>
                <input type="time" id="end-time" className="time-input" />
            </div>
            <div className="input-field data-field">
                <label htmlFor="log-date">Date</label>
                <input type="date" id="log-date" className="date-input" />
            </div>
        </form>
    )
}