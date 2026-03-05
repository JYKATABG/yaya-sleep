import "../styles/Stats.css"


export const Stats = () => {
    return (
        <section className="stats-summary">
            <div className="stats-circle">
                <div className="stats-value">
                    <span className="hours">7h</span>
                    <span className="minutes">30m</span>
                </div>
                <h2 className="stats-label">Avg. sleep</h2>
            </div>
        </section>
    )
}