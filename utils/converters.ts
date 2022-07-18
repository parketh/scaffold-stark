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

export { decimalToFelt, shortStringToFelt, feltToShortString, stringToFeltArray, feltArrayToString }
