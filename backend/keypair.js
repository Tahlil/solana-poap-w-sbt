import {
    Keypair
 
} from '@solana/web3.js';
import bs58 from "bs58";

const keypair = Keypair.generate();
console.log(bs58.encode(keypair.secretKey));
