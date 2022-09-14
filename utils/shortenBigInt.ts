export const shortenBigInt = (bigint: bigint): string => {
    return Number(bigint).toPrecision(4)
}
