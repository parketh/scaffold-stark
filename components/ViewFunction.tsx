import { useState, useContext, FunctionComponent } from "react"
import axios from "axios"

import { Button } from "./index"
import { ContractContext } from "../pages/index"
import { ISetContractContext } from "../interfaces/ContractFunctions.interface"

const ViewFunction: FunctionComponent<{
    contractName: string
    contractAddress: string
    functionName: string
}> = ({ contractName, contractAddress, functionName }) => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext
    const [value, setValue] = useState()

    const callFunction = (ctrName: string, ctrAddr: string, fnName: string): void => {
        const call = async () => {
            const data = {
                contractName: ctrName,
                contractAddress: ctrAddr,
                functionName: fnName,
            }

            const res = await axios.post(`${context.serverUrl}/api/call`, data)
            return JSON.parse(res.data).res
        }
        call().then((res) => {
            setValue(res)
        })
    }

    return (
        <div className="flex w-7/12 relative border border-t-0 border-gray-200 p-6 self-center justify-between">
            <div className="flex gap-3">
                <div className="text-xl text-gray-800">{functionName}</div>
                <span className="self-center text-xs text-green-600 rounded bg-green-100 px-2 py-1">View</span>
            </div>
            <div className="text-xl text-gray-600">{value}</div>
            <Button
                label={"Call"}
                callback={() => {
                    if (!context.contracts) return
                    callFunction(contractName, contractAddress, functionName)
                }}
            />
        </div>
    )
}

export default ViewFunction
