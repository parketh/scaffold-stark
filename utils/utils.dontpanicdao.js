// File taken from https://github.com/dontpanicdao/stark-util/blob/main/src/utils/index.js

import base64js from "base64-js"
import BN from "bn.js"
import { stark } from "starknet"

const getSelectorFromName = stark.getSelectorFromName

function asciiToHex(str) {
    var arr1 = []
    arr1.push("0x")
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16)
        arr1.push(hex)
    }
    return arr1.join("")
}

function toSelector(val) {
    if (val === undefined || val === "") {
        return { hexy: "", inty: "" }
    }
    const hexBN = new BN(removeHexPrefix(getSelectorFromName(val)), 16)

    return { hexy: getSelectorFromName(val), inty: hexBN.toString(10) }
}

function toBN(val) {
    if (BN.isBN(val)) {
        return val
    }
    if (val === undefined || val === "") {
        return ""
    }
    if (val.startsWith("0x") && isHex(removeHexPrefix(val))) {
        return new BN(removeHexPrefix(val), 16)
    } else if (isDecimal(val)) {
        return new BN(val, 10)
    } else {
        const ascHex = asciiToHex(val)
        return new BN(removeHexPrefix(ascHex), 16)
    }
}

function toHex(val) {
    if (val === undefined || val === "") {
        return ""
    }
    if (val.startsWith("0x") && isHex(removeHexPrefix(val))) {
        return val
    } else if (isDecimal(val)) {
        const nbn = new BN(val, 10)
        return addHexPrefix(nbn.toString(16))
    } else {
        return asciiToHex(val)
    }
}

function to256(inVal) {
    if (inVal === undefined || inVal === "") {
        return { low: "", high: "" }
    }
    let mask = new BN(2)
    mask = mask.pow(new BN(128))
    mask = mask.sub(new BN(1))

    let bigIn = toBN(inVal)

    return { low: bigIn.and(mask).toString(), high: bigIn.shrn(128).toString() }
}

function toBig3(val) {
    if (val === undefined || val === "") {
        return { D0: "", D1: "", D2: "" }
    }
    let mask = new BN(2)
    mask = mask.pow(new BN(86))
    mask = mask.sub(new BN(1))
    let bigIn = toBN(val)

    let d0 = bigIn.and(mask)
    bigIn = bigIn.shrn(86)

    let d1 = bigIn.and(mask)
    bigIn = bigIn.shrn(86)

    return { D0: d0.toString(), D1: d1.toString(), D2: bigIn.toString() }
}

function parseBig3(slice) {
    let result = new BN()

    result = result.add(slice.D2)
    result = result.shln(86)
    result = result.add(slice.D1)
    result = result.shln(86)
    result = result.add(slice.D0)

    return result
}

// function utf8ToHex(str) {
//   return Array.from(str).map(c =>
//     c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
//     encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
//   ).join('');
// }

function hexToUtf8(hex) {
    return decodeURIComponent("%" + hex.match(/.{1,2}/g).join("%"))
}

function bytesToHexString(byteArray) {
    return Array.prototype.map
        .call(byteArray, function (byte) {
            if (byteArray !== 32) {
                return ("0" + (byte & 0xff).toString(16)).slice(-2)
            } else {
                return ("" + (byte & 0xff).toString(16)).slice(-2)
            }
        })
        .join("")
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16))
    return bytes
}

function removeHexPrefix(hex) {
    let hexTrim = hex.replace(/^0x/, "")
    if (hexTrim.length % 2 === 1) {
        hexTrim = "0" + hexTrim
    }
    return hexTrim
}

function addHexPrefix(hex) {
    return `0x${removeHexPrefix(hex)}`
}

function fmtActiveAccount(hex) {
    const rmHex = hex.replace(/^0x/, "")
    return rmHex.replace(/^0/, "")
}

function bufferEncode(value) {
    return base64js.fromByteArray(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64ToArray(b64) {
    return base64js.toByteArray(b64)
}

function isHex(val) {
    const regexp = /^[0-9a-fA-F]+$/
    return regexp.test(val)
}

function isDecimal(val) {
    var decimalRegex = /^[0-9]+$/
    return decimalRegex.test(val)
}

function isBase64(val) {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return base64regex.test(val)
}

export {
    asciiToHex,
    toBN,
    removeHexPrefix,
    addHexPrefix,
    fmtActiveAccount,
    to256,
    bufferEncode,
    base64ToArray,
    bytesToHexString,
    hexToBytes,
    toBig3,
    parseBig3,
    isBase64,
    isDecimal,
    hexToUtf8,
    toHex,
    toSelector,
    // utf8ToHex,
}
