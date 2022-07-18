import { expect } from "chai"
import { starknet } from "hardhat"

describe("Test", function () {
    this.timeout(30_000) // 30 seconds - recommended if used with starknet-devnet

    it("should load a previously deployed contract", async function () {
        const contractFactory = await starknet.getContractFactory("Contract")
        const contract = await contractFactory.deploy()

        await contract.invoke("increase_balance", { amount: 10 })
        await contract.invoke("increase_balance", { amount: BigInt(20) })

        const { res } = await contract.call("get_balance")
        expect(res).to.equal(BigInt(30))
    })

    it("should succeed when using the account to invoke a function on another contract", async function () {
        const contractFactory = await starknet.getContractFactory("Contract")
        const contract = contractFactory.getContractAt(
            "0x0603f17b5f80d183ddada6a8111d9b0373c1561946450a65a0f57ad6fed0d4ae"
        )

        const account = await starknet.getAccountFromAddress(
            "0x3ce31ec1fa8d72cff2875d8afca9a0b83e317ac97c3db65d55e9a83f5ceddf0",
            "0x9e43897b37c6e03c4b6b611e1fc2c60b",
            "OpenZeppelin"
        )

        const { res: currBalance } = await account.call(contract, "get_balance")
        const amount = BigInt(10)
        await account.invoke(contract, "increase_balance", { amount })

        const { res: newBalance } = await account.call(contract, "get_balance")
        expect(newBalance).to.deep.equal(currBalance + amount)
    })

    it("should estimate fee", async function () {
        const contractFactory = await starknet.getContractFactory("Contract")
        const contract = await contractFactory.deploy()
        const fee = await contract.estimateFee("increase_balance", { amount: 10n })
        console.log("Estimated fee:", fee.amount, fee.unit)
    })
})
