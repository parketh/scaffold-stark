const formatWei = (wei: number) => {
    const eth = wei / 10 ** 18
    return eth.toFixed(4).toString()
}

export default formatWei
