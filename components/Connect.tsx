import { useState } from "react"
import { useConnectors, useStarknet } from "@starknet-react/core"
import { ConnectorOverlay } from "../components"

const Connect = () => {
    const [open, setOpen] = useState(false)
    const [hover, setHover] = useState(false)
    const { account } = useStarknet()

    const { disconnect } = useConnectors()

    return (
        <div className="w-28 h-8 rounded-full flex justify-center items-center border">
            <ConnectorOverlay open={open} setOpen={setOpen} setHover={setHover} />
            {account ? (
                <div
                    className="flex items-center gap-2 w-full h-full justify-center rounded-full hover:cursor-pointer select-none hover:bg-blue-100 active:bg-blue-200"
                    onClick={() => disconnect()}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {hover ? (
                        <span>Disconnect</span>
                    ) : (
                        <>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>localhost</span>
                        </>
                    )}
                </div>
            ) : (
                <span
                    className="flex w-full h-full justify-center items-center rounded-full cursor-pointer hover:bg-blue-100 active:bg-blue-200 select-none"
                    onClick={() => setOpen(true)}
                >
                    Connect
                </span>
            )}
        </div>
    )
}

export default Connect
