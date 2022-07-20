import Image from "next/image"
import { useEffect, useState, useContext } from "react"
import axios from "axios"
import makeBlockie from "ethereum-blockies-base64"
import { useStarknet } from "@starknet-react/core"

import { shortenAddress } from "../utils/shortenAddress"
import { ContractContext } from "../pages/index"
import { MintTokensOverlay, RefreshButton, CopyButton, Connect } from "../components"
import { ISetContractContext, IContractParams } from "../interfaces/ContractFunctions.interface"
import formatWei from "../utils/formatWei"

const MenuBar = () => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext
    const [balance, setBalance] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const { account } = useStarknet()

    useEffect(() => {
        const getDeployedContracts = async () => {
            const res = await axios.get(`${context.serverUrl}/api/get_deployments`)
            const retrievedContracts: IContractParams[] = JSON.parse(res.data)
            setContext({ ...context, contracts: retrievedContracts })
        }
        getDeployedContracts()
    }, [])

    const getBalance = async () => {
        if (account) {
            const res = await axios.get(`${context.networkUrl}/account_balance?address=${account}`)
            setBalance(res.data.amount)
        }
    }

    useEffect(() => {
        getBalance()
    }, [account])

    return (
        <div className="bg-white fixed w-full top-0 left-0 z-10 flex p-6">
            <MintTokensOverlay open={open} setOpen={setOpen} setBalance={setBalance} contractAddress={account} />
            <div className="flex justify-between w-full">
                <div className="flex flex-col w-full">
                    <span className="text-xl font-semibold ">💠 scaffold-stark</span>
                    <span className="text-sm text-gray-500 hidden md:block">
                        Forkable StarkNet dev stack focused on fast product iterations (inspired by scaffold-eth)
                    </span>
                </div>
                <div className="flex w-full justify-end gap-3 items-center">
                    <div className="w-8 h-8 self-center">
                        {account ? <Image src={makeBlockie(account)} width="32" height="32" /> : <></>}
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-xl flex">{account ? shortenAddress(account) : ""}</span>
                        {account ? <CopyButton value={account ? account : ""} /> : <></>}
                    </div>
                    <div className="flex flex-col justify-start">
                        <span className="text-xl flex self-center">
                            {balance ? `${formatWei(Number(balance))} ETH` : ""}
                        </span>
                        {account ? (
                            <span
                                className="self-center text-sm text-blue-500 select-none cursor-pointer hover:text-blue-300 active:text-blue-400"
                                onClick={() => setOpen(true)}
                            >
                                Mint tokens
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                    {balance ? <RefreshButton callback={getBalance} /> : ""}
                    <Connect />
                </div>
            </div>
        </div>
    )
}

export default MenuBar
