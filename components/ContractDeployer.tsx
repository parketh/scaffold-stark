import { useContext, useEffect, useState } from "react"
import axios from "axios"

import { Button } from "./index"
import { ContractContext } from "../pages/index"
import { IContractParams, ISetContractContext } from "../interfaces/ContractFunctions.interface"

const ContractDeployer = () => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext
    const [ctrName, setCtrName] = useState("")
    const [ctrArgs, setCtrArgs] = useState("")
    const [hidden, setHidden] = useState(true)
    const [loadingAll, setLoadingAll] = useState(false)
    const [loadingSingle, setLoadingSingle] = useState(false)

    const deployContract = (contractName: string, constructorArgs: string | null): void => {
        // If there are contracts loaded and they have not yet been deployed
        if (context.contracts && context.contracts.filter((ctr) => ctr.contractName === contractName).length === 0) {
            setLoadingSingle(true)
            const call = async (): Promise<IContractParams> => {
                const params = {
                    contractName: contractName,
                    constructorArgs: constructorArgs,
                }

                const res = await axios.post(`${context.serverUrl}/api/deploy`, params)

                const returnedContract = JSON.parse(res.data)

                const retrievedFunctions = await axios.post(`${context.serverUrl}/api/get_functions`, {
                    contractName: returnedContract.contractName,
                    contractAddress: returnedContract.contractAddress,
                })

                const newContract = {
                    contractName: returnedContract.contractName,
                    contractAddress: returnedContract.contractAddress,
                    contractFunctions: JSON.parse(retrievedFunctions.data),
                }
                if (context.contracts) {
                    setContext({
                        ...context,
                        contracts: [...context.contracts, newContract],
                    })
                }
                return newContract
            }
            call().then((newContract) => {
                axios.post(`${context.serverUrl}/api/add_deployments`, { newContract: newContract })
                setLoadingSingle(false)
            })
        }
    }

    const deployAllContracts = (): void => {
        setLoadingAll(true)
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
            setLoadingAll(false)
        })
    }

    return (
        <div className="flex flex-col gap-4 w-7/12 relative border border-gray-200 p-6 self-center mb-12">
            <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold w-full">🏭 Contract Deployer</div>
                <span
                    className="self-center text-sm text-blue-500 select-none cursor-pointer hover:text-blue-300 active:text-blue-400"
                    onClick={() => setHidden(!hidden)}
                >
                    {hidden ? "Show" : "Hide"}
                </span>
            </div>
            {hidden ? (
                <></>
            ) : (
                <>
                    <div className="font-semibold w-full">Deploy all contracts</div>
                    <div className="text-sm w-full text-gray-600">
                        Note: Does not currently support constructor arguments. Please deploy contracts individually to
                        specify constructor args.
                    </div>
                    <Button label="Deploy All" callback={() => deployAllContracts()} />
                    <div>{loadingAll ? <Spinner /> : <></>}</div>
                    <div className="w-full border-b my-3" />
                    <div className="font-semibold w-full">Deploy single contract</div>
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
                    <div>{loadingSingle ? <Spinner /> : <></>}</div>
                    <div className="w-full border-b my-3" />
                    <div className="font-semibold w-full">Deployed contracts</div>
                    <div className="text-sm w-full text-gray-600">
                        Note: To amend the list of contracts from below, edit contracts/deployments.txt and hit refresh.
                    </div>
                </>
            )}
        </div>
    )
}

const Spinner = () => {
    return (
        <div role="status" className="flex items-center">
            <svg
                aria-hidden="true"
                className="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
            <span>Deploying...</span>
        </div>
    )
}

export default ContractDeployer
