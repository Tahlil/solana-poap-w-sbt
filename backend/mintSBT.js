import {
    Connection,
    PublicKey,
    Keypair,
    Transaction
} from '@solana/web3.js';
import {
    createMintToCheckedInstruction,
    TOKEN_2022_PROGRAM_ID,
    mintTo 
} from '@solana/spl-token';
import { SBTAddress, ATAAddress } from "./config.js";
import bs58 from "bs58";

// connection
const connection = new Connection("https://api.devnet.solana.com");

const feePayer = Keypair.fromSecretKey(
  bs58.decode("2pcLTP544MYt82qDobCt5mM1x2fLxAQ5KWeJPbQUBVRgkD1hqwjB3mhudu5bT8AQyGGRnPQuU9TRbUQ19Xy4uFh6")
);

const mintAuthority = Keypair.fromSecretKey(
  bs58.decode("7Ws2c9JjN3dGRRx3JPgZ53FWB7ipfVNCSWqiVp4GGYog2iNgE488apVCZt68xVtzp3jj42mVcaeJrb3uTAHrcFS")
);
console.log("mint Authority public key", mintAuthority.publicKey);

const mintPubkey = new PublicKey(SBTAddress);

const associatedTokenAccount = new PublicKey(ATAAddress);
const ownerAccount = new PublicKey("cCx8fugvvUFMEpuryqSzrDs6PBDCpXkorH7kodGbM5r");
console.log(mintPubkey);

// mint token

(async () => {

  // let tx = new Transaction();
  // tx.add(
  //   createMintToCheckedInstruction(
  //     mintPubkey,
  //     associatedTokenAccount,
  //     mintAuthority.publicKey, // mint auth
  //     1, // amount
  //     0, // decimals
  //     [],
  //     TOKEN_2022_PROGRAM_ID
  //   )
  // );
  // console.log(`txhash: ${await connection.sendTransaction(tx, [feePayer, mintAuthority])}`);
    let sig = await mintTo(
        connection,
        feePayer,
        mintPubkey,
        associatedTokenAccount,
        mintAuthority,
        1,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID
    );
    console.log(sig);

})();
