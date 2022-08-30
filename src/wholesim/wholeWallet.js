// // import Network from "bitcoinjs-lib"
// // import ECPairFactory  from "ecpair"
// // import ecc from "tiny-secp256k1"
// import ECPairFactory from 'ecpair';
// import * as ecc from 'tiny-secp256k1';
import jsrsasign from 'jsrsasign'; 
import {imitationPrivate,imitationPublic} from "../utils/utils"
//全流程计划先创建数据，后通过数据
export function walletCreate(walletId,auth) {
    // const TestNet = bitcoin.networks.testnet;
    // // const TestNet = Network.testnet;
    // const ECPair = ECPairFactory(ecc);
    // let keyPair=ECPair.makeRandom({network:TestNet});
    // var private_key = keyPair.privateKey.toString('hex');
    // var public_key = keyPair.publicKey.toString('hex');
    // console.log('pri_key = ' + private_key);
    // console.log('pub_key = ' + public_key);
    const wallet = {
        walletId:walletId,
        privateKey:imitationPrivate(),//1674
        publicKey:imitationPublic(),//404
        auth:auth
    }
    return wallet;
}