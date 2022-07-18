#! /bin/bash
while getopts n:c:f:i:a:p flag
do
    case "${flag}" in
        n) contract_name=${OPTARG};;
        c) contract_address=${OPTARG};;
        f) function=${OPTARG};;
        i) inputs=${OPTARG};;
        a) account_address=${OPTARG};;
        p) private_key=${OPTARG};;
    esac
done

signature="${account_address} ${private_key}"

npx hardhat starknet-invoke --starknet-network devnet --contract ${contract_name} --address ${contract_address} --function ${function} --inputs ${inputs} --signature ${signature}