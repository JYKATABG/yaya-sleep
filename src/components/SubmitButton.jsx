import "../../src/App.css"

export const SubmitButton = ({ isPending }) => {
    return <button type="submit" className="submit-btn" disabled={isPending} >
        {isPending ? "Recording..." : "Submit Record"}
    </button>
}