import { Dispatch, SetStateAction } from "react"
import { connect, IStarknetWindowObject } from "@argent/get-starknet"

export interface ISetContractContext {
    context: IContractContext
    setContext: (context: IContractContext) => void
}

export interface IContractContext {
    serverUrl: string
    networkUrl: string
    account: IAccount | null
    session: any
    contracts: Array<IContractParams> | null
}

export interface IContractParams {
    contractName: string
    contractAddress: string
    contractFunctions: IContractFunctions
}

export interface IFunctionCallParams {
    contractName: string
    contractAddress: string
    functionName: string
}

export interface IContractNameAddress {
    contractName: string | null
    contractAddress: string | null
}

export interface IContractNameStatus {
    contractName: string | null
    status: string | null
}

export interface IContractFunctions extends Array<IContractFunction> {}

export interface IContractFunction {
    name: string
    type: string
    inputs: IInputOutputList
    outputs: IInputOutputList
}

export interface IAccount {
    address: string
    publicKey: string
    privateKey: string
    balance?: number
}

export interface IContractABI {
    inputs: Array<IArg>
    name: string
    outputs: Array<IArg>
    stateMutability?: string
    type: string
}

export interface IInputOutputList extends Array<IInputOutput> {}

export interface IInputOutput {
    name: string
    type: string
    value?: string
}

export interface IArg {
    name: string
    value: string
}

export interface IArgInput {
    name: string
    type: string
    argIdx: number
    argList: Array<IArg>
    setArgList: Dispatch<SetStateAction<Array<IArg>>>
}

export interface IAccountBalance {
    amount: number
    unit: string
}

export interface StarkNetWindow extends Window {
    starknet: IStarknetWindowObject | undefined
}
