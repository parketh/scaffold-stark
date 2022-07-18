import { useContext, useEffect, useState } from "react"
import axios from "axios"

import { Button } from "./index"
import { ContractContext } from "../pages/index"
import { IContractParams, ISetContractContext } from "../interfaces/ContractFunctions.interface"

const ContractDeployer = () => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext
    const [ctrName, setCtrName] = useState("")
    const [ctrArgs, setCtrArgs] = useState("")

    const deployContract = (contractName: string, constructorArgs: string | null): void => {
        if (context.contracts && context.contracts.filter((ctr) => ctr.contractName === contractName).length === 0) {
            const call = async (): Promise<IContractParams> => {
                const data = {
                    contractName: contractName,
                    constructorArgs: constructorArgs,
                }

                const res = await axios.post(`${context.serverUrl}/api/deploy`, data)
                return res.data
            }
            call().then((res) => {
                // TODO - setContext
            })
        }
    }

    const deployAllContracts = (): void => {
        const call = async (): Promise<Array<IContractParams>> => {
            const res = await axios.post(`${context.serverUrl}/api/deploy_all`)
            const contracts = JSON.parse(res.data)
            const updatedContracts: Array<IContractParams> = await Promise.all(
                contracts.map(async (contr: { contractName: string; contractAddress: string }) => {
                    const retrievedFunctions = await axios.post(`${context.serverUrl}/api/get_functions`, {
                        contractName: contr.contractName,
                        contractAddress: contr.contractAddress,
                    })
                    return {
                        contractName: contr.contractName,
                        contractAddress: contr.contractAddress,
                        contractFunctions: JSON.parse(retrievedFunctions.data),
                    }
                })
            )
            setContext({
                ...context,
                contracts: updatedContracts,
            })
            return updatedContracts
        }
        call().then((updatedContracts) => {
            axios.post(`${context.serverUrl}/api/save_deployments`, { updatedContracts: updatedContracts })
        })
    }

    return (
        <div className="flex flex-col gap-4 w-7/12 relative border border-gray-200 p-6 self-center mb-12">
            <div className="text-2xl font-semibold w-full">🏭 Contract Deployer</div>
            <div className="font-semibold w-full">Deploy all contracts</div>
            <div className="text-sm w-full text-gray-600">
                Note: Does not currently support constructor arguments. Please deploy contracts individually to specify
                constructor args.
            </div>
            <Button label="Deploy All" callback={() => deployAllContracts()} />
            <div className="w-full border-b my-3" />
            <div className="text- font-semibold w-full">
                Deploy single contract<span className="text-red-600 ml-2">{"TODO"}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="w-40">Contract name</span>
                <input
                    type="text"
                    className="border rounded px-2 py-0.5 w-full"
                    placeholder="e.g. 'Contract' for 'Contract.cairo'"
                    value={ctrName}
                    onChange={(e) => setCtrName(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="w-40">Constructor args</span>
                <input
                    type="text"
                    className="border rounded px-2 py-0.5 w-full"
                    placeholder="Constructor args (space delimited)"
                    value={ctrArgs}
                    onChange={(e) => setCtrArgs(e.target.value)}
                />
            </div>
            <Button label="Deploy" callback={() => deployContract(ctrName, ctrArgs)} />
            <div className="w-full border-b my-3" />
            <div className="font-semibold w-full">Deployed contracts</div>
            <div className="text-sm w-full text-gray-600">
                Note: To amend the list of contracts from below, edit contracts/deployments.txt and hit refresh.
            </div>
        </div>
    )
}

export default ContractDeployer
