import { FunctionComponent, useContext, useEffect, useState } from "react"
import Image from "next/image"
import makeBlockie from "ethereum-blockies-base64"

import { RefreshButton, CopyButton, MintTokensOverlay } from "../components"
import { ContractContext } from "../pages/index"
import { shortenAddress } from "../utils/shortenAddress"
import { ISetContractContext } from "../interfaces/ContractFunctions.interface"
import formatWei from "../utils/formatWei"
import axios from "axios"

const ContractHeader: FunctionComponent<{ name: string; address: string }> = ({ name, address }) => {
    const { context } = useContext(ContractContext) as ISetContractContext
    const [balance, setBalance] = useState<number | null>(null)
    const [open, setOpen] = useState(false)

    const getBalance = async () => {
        if (context.contracts) {
            const res = await axios.get(`${context.networkUrl}/account_balance?address=${address}`)
            setBalance(res.data.amount)
        }
    }

    useEffect(() => {
        getBalance()
    }, [])

    if (!context.contracts) return <></>

    return (
        <div className="flex w-7/12 relative border border-gray-200 p-4 self-center">
            <div className="text-2xl font-semibold">{name}</div>
            <div className="absolute right-3 gap-3 flex items-center -mt-2">
                <div className="w-8 h-8">
                    <Image src={makeBlockie(address)} width="32" height="32" />
                </div>
                <span className="text-xl flex">{shortenAddress(address)}</span>
                <CopyButton value={address} />
                <div className="flex flex-col items-center">
                    <span className="text-xl flex">{`${formatWei(Number(balance))} ETH`}</span>
                    <span
                        className="self-center text-sm text-blue-500 select-none cursor-pointer hover:text-blue-300 active:text-blue-400"
                        onClick={() => setOpen(true)}
                    >
                        Mint tokens
                    </span>
                    <MintTokensOverlay
                        open={open}
                        setOpen={setOpen}
                        contractAddress={address}
                        setBalance={setBalance}
                    />
                </div>
                <RefreshButton callback={getBalance} />
            </div>
        </div>
    )
}

export default ContractHeader
