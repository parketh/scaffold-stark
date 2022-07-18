import { useContract } from "@starknet-react/core"
import React, { FunctionComponent } from "react"
import { IContractFunctions } from "../interfaces/ContractFunctions.interface"
import { ContractHeader, ContractFunctions } from "./index"

const Contract: FunctionComponent<{ name: string; address: string; functions: IContractFunctions }> = ({
    name,
    address,
    functions,
}) => {
    const abi = require(`../starknet-artifacts/contracts/${name}.cairo/${name}_abi.json`)
    const { contract } = useContract({ abi: abi, address: address })

    return (
        <div className="flex flex-col justify-center mb-12">
            <ContractHeader name={name} address={address} />
            <ContractFunctions name={name} address={address} functions={functions} contract={contract} />
        </div>
    )
}

export default Contract
