import Web3 from 'web3';
import * as FunnyCoinJSON from '../../../build/contracts/FunnyCoin.json';
import { FunnyCoin } from '../../types/FunnyCoin';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};
export class FunnyCoinWrapper {
    web3: Web3;

    contract: FunnyCoin;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(FunnyCoinJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getStoredValue(fromAddress: string) {
        const data = await this.contract.methods.totalSupply().call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async setStoredValue(value: number, fromAddress: string) {
        const tx = await this.contract.methods.burn(value).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });
        
        return tx;
    }

    async deploy(fromAddress: string) {
        const contract = this.contract
            .deploy({
                data: FunnyCoinJSON.bytecode,
                arguments: [1000]
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress
            });

        let transactionHash: string = null;

        contract.on('transactionHash', (hash: string) => {
            transactionHash = hash;
        });


        const tx = await contract;

        this.useDeployed(tx.options.address);
        return transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
