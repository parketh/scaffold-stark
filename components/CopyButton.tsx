import { FunctionComponent } from "react"

const CopyButton: FunctionComponent<{ value: string }> = ({ value }) => {
    const copyValue = () => {
        navigator.clipboard.writeText(value)
    }

    return (
        <div
            className="w-5 h-5 cursor-pointer select-none hover:opacity-70 active:opacity-90"
            onClick={() => copyValue()}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                    fill="#2196F3"
                />
            </svg>
        </div>
    )
}

export default CopyButton
