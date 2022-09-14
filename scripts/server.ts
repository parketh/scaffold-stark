import express from "express"
import cors from "cors"
import fs from "fs"
import path from "path"

const { exec } = require("child_process")
const bodyParser = require("body-parser")

const starknet = require("hardhat").starknet

import {
    IContractFunction,
    IContractNameAddress,
    IContractNameStatus,
    IInputOutput,
} from "../interfaces/ContractFunctions.interface"

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Max-Age", "1800")
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS")
})

app.get("/api/predeployed_accounts", async (req, res) => {
    const predeployedAccounts = await starknet.devnet.getPredeployedAccounts()
    res.status(200).json(predeployedAccounts)
})

app.post("/api/call", async (req, res) => {
    const callFunction = async (contractName: string, contractAddress: string, functionName: string) => {
        const contractFactory = await starknet.getContractFactory(contractName)
        const contract = await contractFactory.getContractAt(contractAddress)
        const callResponse = await contract.call(functionName)
        return callResponse
    }

    try {
        const { contractName, contractAddress, functionName } = req.body
        const callResponse = await callFunction(contractName, contractAddress, functionName)
        res.status(200).json(JSON.stringify({ res: callResponse.res.toString() }))
    } catch (err) {
        console.error(err)
    }
})

app.post("/api/deploy_all", async (req, res) => {
    try {
        exec(`bash scripts/deploy_all.sh`, (error: any, stdout: any, _stderr: any) => {
            if (error !== null) {
                console.log("error: " + error)
            }

            const matchRegex = (text: string, regex: RegExp) => {
                return text
                    .split("Deploying")
                    .map((str) => str.match(regex))
                    .filter((el) => {
                        return el != null
                    })
                    .flat()
            }

            const names = matchRegex(String(stdout), /(?<=\/)[^\/]*(?=.cairo)/g)

            const addresses = matchRegex(String(stdout), /\b0x[a-f0-9]{64}\b/g)

            const success = matchRegex(String(stdout), /\b(?:Succeeded|Failed)\b/g)

            const contractNames: Array<IContractNameStatus> = names
                .map((name, i) => {
                    if (success[i] === "Succeeded") {
                        return {
                            contractName: name,
                            status: success[i],
                        }
                    } else
                        return {
                            contractName: null,
                            status: null,
                        }
                })
                .filter((el) => {
                    return el.contractName != null
                })

            const contracts: Array<IContractNameAddress> = contractNames.map((ctr, i) => {
                return {
                    contractName: ctr ? ctr.contractName : "",
                    contractAddress: addresses ? addresses[i] : "",
                }
            })
            res.status(200).json(JSON.stringify(contracts))
        })
    } catch (err) {
        res.status(404).json({ error: err })
    }
})

app.post("/api/deploy", async (req, res) => {
    const { contractName, constructorArgs } = req.body

    try {
        exec(
            `bash scripts/deploy.sh -n ${contractName} ${constructorArgs ? `-c "${constructorArgs}"` : ""}`,
            (error: null, stdout: any, stderr: any) => {
                if (error !== null) {
                    console.log("error: " + error)
                }

                const name = String(stdout).match(/(?<=\/)[^\/]*(?=.cairo)/g)

                const address = String(stdout).match(/\b0x[a-f0-9]{64}\b/g)

                const contracts: IContractNameAddress = {
                    contractName: name ? String(name) : null,
                    contractAddress: address ? String(address) : null,
                }

                res.status(200).json(JSON.stringify(contracts))
            }
        )
    } catch (err) {
        res.status(404).json({ err: err })
    }
})

app.post("/api/get_functions", async (req, res) => {
    try {
        const { contractName, contractAddress } = req.body
        const contractFactory = await starknet.getContractFactory(contractName)
        const contract = await contractFactory.getContractAt(contractAddress)

        const functions = Object.values(contract.abi).filter((fn: any) => fn.type === "function")

        const updatedFunctions: Array<IContractFunction> = functions.map((fn: any): IContractFunction => {
            return {
                name: String(fn.name),
                type: fn.stateMutability === "view" ? "view" : "external",
                inputs: fn.inputs.map((inp: { name: any; type: any }): IInputOutput => {
                    return { name: String(inp.name), type: String(inp.type) }
                }),
                outputs: fn.outputs.map((inp: { name: any; type: any }): IInputOutput => {
                    return { name: String(inp.name), type: String(inp.type) }
                }),
            }
        })

        res.status(200).json(JSON.stringify(updatedFunctions))
    } catch (err) {
        res.status(404).json({ err: err })
    }
})

app.post("/api/save_deployments", async (req, res) => {
    try {
        const { updatedContracts } = req.body
        const content = String(JSON.stringify(updatedContracts))
        const jsonPath = path.join(__dirname, "..", "contracts", "deployments.txt")

        fs.writeFile(jsonPath, content, { flag: "w+" }, (err) => {
            if (err) throw err
            console.log("Deployments saved: contracts/deployments.txt")
            res.status(200)
        })
    } catch (err) {
        console.error(err)
    }
})

app.post("/api/add_deployments", async (req, res) => {
    try {
        const { newContract } = req.body
        const jsonPath = path.join(__dirname, "..", "contracts", "deployments.txt")

        fs.readFile(jsonPath, "utf8", (err, data) => {
            let contracts = JSON.parse(data)
            contracts.push(newContract)
            console.log(contracts)
            const newContent = String(JSON.stringify(contracts))
            console.log(newContent)

            fs.writeFile(jsonPath, newContent, { flag: "w+" }, (err) => {
                if (err) throw err
                console.log("Deployments saved: contracts/deployments.txt")
                res.status(200)
            })
        })
    } catch (err) {
        console.error(err)
    }
})

app.get("/api/get_deployments", async (req, res) => {
    try {
        const jsonPath = path.join(__dirname, "..", "contracts", "deployments.txt")

        fs.readFile(jsonPath, "utf8", (err, data) => {
            if (err) throw err
            res.status(200).json(data)
        })
    } catch (err) {
        console.error(err)
    }
})

app.get("/api/transaction/:hash", async (req, res) => {
    try {
        const { hash } = req.params
        const tx = await starknet.getTransaction(hash)
        res.status(200).json(tx)
    } catch (err) {
        console.error(err)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
