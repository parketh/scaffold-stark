import { useRef, useContext, Fragment, FunctionComponent, Dispatch, SetStateAction, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ContractContext } from "../pages/index"
import { ISetContractContext } from "../interfaces/ContractFunctions.interface"
import axios from "axios"
import { useStarknet } from "@starknet-react/core"

const MintTokensOverlay: FunctionComponent<{
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    setBalance: Dispatch<SetStateAction<number | null>>
    contractAddress: string | undefined
}> = ({ open, setOpen, setBalance, contractAddress }) => {
    const { context } = useContext(ContractContext) as ISetContractContext
    const [address, setAddress] = useState<string>("")
    const [amount, setAmount] = useState<string>("")

    useEffect(() => {
        setAmount("")
    }, [open])

    const mint = async (mintAddress: string | undefined, amount: string) => {
        if (mintAddress && Number(amount) !== NaN && Number(amount) > 0) {
            const data = {
                address: mintAddress,
                amount: Number(amount) * 10 ** 18,
            }
            const res = await axios.post(`${context.networkUrl}/mint`, data)
            console.log(res.data.new_balance)
            setBalance(res.data.new_balance)
        }
    }

    const amountRef = useRef(null)

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={amountRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 mb-6 font-medium text-gray-900"
                                        >
                                            Mint Tokens
                                        </Dialog.Title>
                                        <div className="mt-2 flex flex-col gap-2 w-full">
                                            <div className="flex items-center gap-3">
                                                <span className="w-36">Address</span>
                                                <input
                                                    type="text"
                                                    className="border rounded px-2 py-0.5 w-full"
                                                    value={contractAddress}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-36">Amount (ETH)</span>
                                                <input
                                                    type="text"
                                                    className="border rounded px-2 py-0.5 w-full"
                                                    placeholder="ETH"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    ref={amountRef}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setOpen(false)
                                            mint(contractAddress, amount)
                                        }}
                                    >
                                        Mint
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default MintTokensOverlay
