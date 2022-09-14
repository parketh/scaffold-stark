import { useState, useContext, FunctionComponent } from "react"
import axios from "axios"

import { Button, CopyButton } from "./index"
import { ContractContext } from "../pages/index"
import { ISetContractContext, DisplayType } from "../interfaces/ContractFunctions.interface"
import { bigNumberToHex } from "../utils/converters"
import { shortenBigInt } from "../utils/shortenBigInt"
import { shortenAddress } from "../utils/shortenAddress"

const ViewFunction: FunctionComponent<{
    contractName: string
    contractAddress: string
    functionName: string
}> = ({ contractName, contractAddress, functionName }) => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext
    const [value, setValue] = useState<bigint>()
    const [type, setType] = useState<DisplayType>(0) // 0 = felt, 1 = hex

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
            <div className={`text-xl text-gray-600 flex gap-4 ${value ? "" : "hidden"}`}>
                <div>
                    {value
                        ? type === 0
                            ? String(value).length > 10
                                ? shortenBigInt(value)
                                : value.toString()
                            : `0x${shortenAddress(bigNumberToHex(value))}`
                        : ""}
                </div>
                <div className="flex flex-col -my-2">
                    <span
                        className={`self-center text-sm text-blue-500 select-none cursor-pointer hover:text-blue-300 active:text-blue-400`}
                        onClick={() => setType(0)}
                    >
                        Felt
                    </span>
                    <span
                        className="self-center text-sm text-blue-500 select-none cursor-pointer hover:text-blue-300 active:text-blue-400"
                        onClick={() => setType(1)}
                    >
                        Hex
                    </span>
                </div>
                <CopyButton value={value ? (type === 0 ? value.toString() : `0x${bigNumberToHex(value)}`) : ""} />
            </div>

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
