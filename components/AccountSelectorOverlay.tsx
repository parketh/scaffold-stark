import { useRef, useContext, Fragment, FunctionComponent, Dispatch, SetStateAction } from "react"
import { Dialog, Transition } from "@headlessui/react"
import makeBlockie from "ethereum-blockies-base64"
import Image from "next/image"

import { shortenAddress } from "../utils/shortenAddress"
import { ContractContext } from "../pages/index"
import { IAccount, ISetContractContext } from "../interfaces/ContractFunctions.interface"
import formatWei from "../utils/formatWei"
import axios from "axios"

const AccountSelectorOverlay: FunctionComponent<{
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    predeployedAccounts: Array<IAccount>
}> = ({ open, setOpen, predeployedAccounts }) => {
    const { context, setContext } = useContext(ContractContext) as ISetContractContext

    const cancelButtonRef = useRef(null)

    const switchAccount = (acc: IAccount): void => {
        const getBalance = async (address: string) => {
            const res = await axios.get(`${context.networkUrl}/account_balance?address=${address}`)
            return Number(res.data.amount)
        }

        getBalance(acc.address).then((res) => {
            setContext({
                ...context,
                account: {
                    address: acc.address,
                    publicKey: acc.publicKey,
                    privateKey: acc.privateKey,
                    balance: res,
                },
            })
            setOpen(false)
        })
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                                            Predeployed accounts
                                        </Dialog.Title>
                                        <div className="mt-2 flex flex-col gap-2 w-full">
                                            {predeployedAccounts.map((acc, i) => {
                                                return (
                                                    <div
                                                        className="flex items-center gap-4 w-full p-1.5 hover:bg-blue-100 justify-between rounded cursor-pointer"
                                                        onClick={() => switchAccount(acc)}
                                                        key={i}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <p>{i + 1}</p>
                                                            <Image
                                                                src={makeBlockie(acc.address)}
                                                                width="32"
                                                                height="32"
                                                            />
                                                            <p className="text-gray-700">
                                                                {shortenAddress(acc.address)}
                                                            </p>
                                                            <p>
                                                                {acc.address === context.account?.address ? "✅" : ""}
                                                            </p>
                                                        </div>
                                                        <p className="text-gray-700">
                                                            {acc.balance ? formatWei(acc.balance) : ""}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
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

export default AccountSelectorOverlay
