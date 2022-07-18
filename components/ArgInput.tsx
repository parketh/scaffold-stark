import { FunctionComponent, useEffect } from "react"
import { IArgInput } from "../interfaces/ContractFunctions.interface"

const ParamInput: FunctionComponent<IArgInput> = ({ name, type, argIdx, argList, setArgList }) => {
    useEffect(() => {
        if (!argList[argIdx]) {
            setArgList([...argList, { name: name, value: "" }])
        }
    }, [])

    const handleChange = (e: { target: { value: string } }) => {
        const updatedList = argList.map((arg) => {
            if (arg.name === name) {
                return { name: name, value: e.target.value }
            } else return arg
        })
        setArgList(updatedList)
    }

    return (
        <div className="flex gap-3">
            <span className="text-gray-500 self-center">{name}</span>
            <input
                type="text"
                className="border rounded w-full px-2 py-0.5 self-center"
                placeholder={type}
                value={argList[argIdx] ? argList[argIdx].value : ""}
                onChange={handleChange}
            />
        </div>
    )
}

export default ParamInput
