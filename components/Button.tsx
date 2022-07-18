import { FunctionComponent } from "react"

const Button: FunctionComponent<{ label: String; callback: () => void }> = ({ label, callback }) => {
    return (
        <button
            className="text-blue-400 text-sm bg-white hover:bg-blue-100 active:bg-blue-200 border border-blue-400 font-bold py-0.5 px-3 rounded select-none"
            type="button"
            onClick={callback}
        >
            {label}
        </button>
    )
}

export default Button
