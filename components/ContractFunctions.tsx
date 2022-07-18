import { useState, useContext, FunctionComponent } from "react"
import { ExternalFunction } from "./index"
import { ContractContext } from "../pages/index"
import { ISetContractContext, IArg, IContractFunctions } from "../interfaces/ContractFunctions.interface"
import { Contract } from "starknet"
import { ViewFunction } from "../components"

const ContractFunctions: FunctionComponent<{
    name: string
    address: string
    functions: IContractFunctions
    contract: Contract | undefined
}> = ({ name, address, functions, contract }) => {
    const { context } = useContext(ContractContext) as ISetContractContext
    const [argList, setArgList] = useState<IArg[]>([])

    if (!context.contracts) return <></>

    return (
        <>
            {functions.map((fn, i) => {
                if (fn.type === "view") {
                    return <ViewFunction key={i} contractName={name} contractAddress={address} functionName={fn.name} />
                } else if (fn.type === "external") {
                    return (
                        <ExternalFunction
                            key={i}
                            contract={contract}
                            functionName={fn.name}
                            functionInputs={fn.inputs}
                            argList={argList}
                            setArgList={setArgList}
                        />
                    )
                } else {
                    return <div key={i}></div>
                }
            })}
        </>
    )
}

export default ContractFunctions
