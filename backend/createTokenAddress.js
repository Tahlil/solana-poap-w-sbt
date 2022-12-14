import { Keypair, Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js";

import {
    ACCOUNT_SIZE,
    createAssociatedTokenAccountInstruction,
    createInitializeAccountInstruction,
    getAssociatedTokenAddress,
    getMinimumBalanceForRentExemptAccount,
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount
} from "@solana/spl-token";

import bs58 from "bs58";

// connection

console.log(bs58);
// 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8


(async () => {
    const connection = new Connection("https://api.devnet.solana.com");
   

    const feePayer = Keypair.fromSecretKey(
        bs58.decode("2pcLTP544MYt82qDobCt5mM1x2fLxAQ5KWeJPbQUBVRgkD1hqwjB3mhudu5bT8AQyGGRnPQuU9TRbUQ19Xy4uFh6")
    );
    console.log(feePayer.publicKey.toBase58());


    const ownerPublicKey = new PublicKey("cCx8fugvvUFMEpuryqSzrDs6PBDCpXkorH7kodGbM5r")

    const mintPubkey = new PublicKey("FXi8GKNvfzsDRnog68S1h4XaUaimygCYb1x4idGNg4o1")
    const TokenID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    let ata = await getAssociatedTokenAddress(
        mintPubkey, // mint
        ownerPublicKey, // owner
        false, // allow owner off curve
        TOKEN_2022_PROGRAM_ID
      );
      console.log(`ata: ${ata.toBase58()}`);
  
      let tx = new Transaction();
      tx.add(
        createAssociatedTokenAccountInstruction(
          feePayer.publicKey, // payer
          ata, // ata
          ownerPublicKey, // owner
          mintPubkey, // mint
          TOKEN_2022_PROGRAM_ID
        )
      );
      const res = await connection.sendTransaction(tx, [feePayer]);
      console.log(res);

}
)();