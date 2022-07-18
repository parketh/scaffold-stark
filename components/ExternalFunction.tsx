import { Dispatch, FunctionComponent, SetStateAction } from "react"
import { useStarknetInvoke } from "@starknet-react/core"

import { ArgInput, Button } from "./index"
import { IArg, IContractFunctions, IInputOutputList } from "../interfaces/ContractFunctions.interface"
import { Contract } from "starknet"

const ExternalFunction: FunctionComponent<{
    contract: Contract | undefined
    functionName: string
    argList: Array<IArg>
    functionInputs: IInputOutputList
    setArgList: Dispatch<SetStateAction<IArg[]>>
}> = ({ contract, functionName, functionInputs, argList, setArgList }) => {
    const { invoke } = useStarknetInvoke({ contract: contract, method: functionName })

    const invokeFunction = async (functionName: string, args: Array<unknown>) => {
        await invoke({
            args: args,
            metadata: { method: functionName },
        })
    }

    const handleInvoke = () => {
        const args = argList.map((arg) => arg.value)
        console.log(args)

        invokeFunction(functionName, args)
    }

    return (
        <div className="flex flex-col w-7/12 relative border border-t-0 border-gray-200 p-6 self-center gap-3 form">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <div className="text-xl text-gray-800">{functionName}</div>
                    <span className="self-center text-xs text-orange-600 rounded bg-orange-100 px-2 py-1">
                        External
                    </span>
                </div>
                <Button label={"Invoke"} callback={() => handleInvoke()} />
            </div>

            <div className="flex flex-col pl-6 gap-3">
                {functionInputs.map((param, k) => {
                    return (
                        <ArgInput
                            name={param.name}
                            type={param.type}
                            key={k}
                            argIdx={k}
                            argList={argList}
                            setArgList={setArgList}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ExternalFunction
