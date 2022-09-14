import { BN } from "bn.js"
import * as BNType from "bn.js"
import { feltArrToStr, shortStringFeltToStr, strToFeltArr, strToShortStringFelt } from "./cairoStringUtils.sekaiStudio"
import { toBN } from "./utils.dontpanicdao"

const FELT_MAX_VAL = new BN("3618502788666131106986593281521497120414687020801267626233049500247285301248", 10)

const DEFAULT_RESULT_OBJECT = {
    output: null,
    isValid: true,
}

export interface ConvertOutput<T> {
    output: T
    isValid: boolean | null
}

function toBigNumber(input: any): BNType | null {
    const number = toBN(input)
    return BN.isBN(number) ? number : null
}

function decimalToFelt(input: string): ConvertOutput<BNType | null> {
    const inputInt = Number(input)
    if (isNaN(inputInt)) {
        return DEFAULT_RESULT_OBJECT
    }
    const value = toBigNumber(input)
    return {
        output: value,
        isValid: value ? value.lt(FELT_MAX_VAL) : null,
    }
}

function shortStringToFelt(input: string): ConvertOutput<BNType | null> {
    if (typeof input !== "string" || input === "") {
        return DEFAULT_RESULT_OBJECT
    }
    const value = strToShortStringFelt(input)
    const valueBN = toBigNumber(value.toString())
    return {
        output: valueBN ? valueBN : null,
        isValid: valueBN ? valueBN.lt(FELT_MAX_VAL) : null,
    }
}

function feltToShortString(input: string): ConvertOutput<string | null> {
    const inputInt = Number(input)
    if (isNaN(inputInt)) {
        return DEFAULT_RESULT_OBJECT
    }
    const number = BigInt(input)
    const value = shortStringFeltToStr(number)
    const numberBN = toBigNumber(value)
    return {
        output: value,
        isValid: numberBN ? numberBN.lt(FELT_MAX_VAL) : null,
    }
}

function stringToFeltArray(input: string): ConvertOutput<string[] | null> {
    const value = strToFeltArr(input).map((val) => val.toString())
    return {
        output: value ? value : null,
        isValid: true,
    }
}

function feltArrayToString(input: string): ConvertOutput<string | null> {
    if (typeof input !== "string" || input === "") {
        return DEFAULT_RESULT_OBJECT
    }
    const valueArr = input
        .replaceAll(" ", "")
        .split(",")
        .map((val) => BigInt(val))
    const value = feltArrToStr(valueArr)
    return {
        output: value ? value : null,
        isValid: true,
    }
}

function bigNumberToHex(bn: bigint) {
    bn = BigInt(bn)

    var pos = true
    if (bn < 0) {
        pos = false
        bn = bitnot(bn)
    }

    var hex = bn.toString(16)
    if (hex.length % 2) {
        hex = "0" + hex
    }

    if (pos && 0x80 & parseInt(hex.slice(0, 2), 16)) {
        hex = "00" + hex
    }

    return hex
}

function bitnot(bn: bigint) {
    bn = -bn
    var bin = bn.toString(2)
    var prefix = ""
    while (bin.length % 8) {
        bin = "0" + bin
    }
    if ("1" === bin[0] && -1 !== bin.slice(1).indexOf("1")) {
        prefix = "11111111"
    }
    bin = bin
        .split("")
        .map(function (i) {
            return "0" === i ? "1" : "0"
        })
        .join("")
    return BigInt("0b" + prefix + bin) + BigInt(1)
}

export { bigNumberToHex, decimalToFelt, shortStringToFelt, feltToShortString, stringToFeltArray, feltArrayToString }
