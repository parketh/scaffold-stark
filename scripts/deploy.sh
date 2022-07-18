#! /bin/bash
while getopts n:c: flag
do
    case "${flag}" in
        n) contract_name=${OPTARG};;
        c) constructor_args=${OPTARG};;
    esac
done

if [ -z "$constructor_args" ]
    then npx hardhat starknet-deploy --starknet-network devnet starknet-artifacts/contracts/${contract_name}.cairo
else 
    npx hardhat starknet-deploy --starknet-network devnet starknet-artifacts/contracts/${contract_name}.cairo --inputs ${constructor_args}
fi