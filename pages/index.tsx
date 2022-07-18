import React, { useState, createContext } from "react"
import { StarknetProvider, getInstalledInjectedConnectors } from "@starknet-react/core"

import { MenuBar, Contract, ContractDeployer, PageSelector, Converter } from "../components"
import { ISetContractContext, IContractContext } from "../interfaces/ContractFunctions.interface"

export const ContractContext = createContext<ISetContractContext | null>(null)

const Home = () => {
    const [context, setContext] = useState<IContractContext>({
        serverUrl: "http://localhost:3001",
        networkUrl: "http://localhost:5050",
        account: null,
        session: {},
        contracts: [],
    })

    const connectors = getInstalledInjectedConnectors()

    const [page, setPage] = useState("Home")

    if (!context.contracts) return <></>

    return (
        <div className="flex flex-col justify-center p-5">
            <StarknetProvider connectors={connectors} autoConnect>
                <ContractContext.Provider value={{ context, setContext }}>
                    <MenuBar />
                    <div className="mb-24"></div>
                    <PageSelector page={page} setPage={setPage} />
                    {page === "Home" ? (
                        <>
                            <ContractDeployer />
                            {context.contracts.map((ctr, i) => (
                                <Contract
                                    key={i}
                                    name={ctr.contractName}
                                    address={ctr.contractAddress}
                                    functions={ctr.contractFunctions}
                                />
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                    {page === "Converter" ? (
                        <>
                            <Converter />
                        </>
                    ) : (
                        <></>
                    )}
                </ContractContext.Provider>
            </StarknetProvider>
        </div>
    )
}

export default Home
