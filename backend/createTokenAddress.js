import { Keypair, Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js";
import { SBTAddress } from "./config.js";
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



(async () => {
    const connection = new Connection("https://api.devnet.solana.com");
   

    const feePayer = Keypair.fromSecretKey(
        bs58.decode("2pcLTP544MYt82qDobCt5mM1x2fLxAQ5KWeJPbQUBVRgkD1hqwjB3mhudu5bT8AQyGGRnPQuU9TRbUQ19Xy4uFh6")
    );
    console.log(feePayer.publicKey.toBase58());


    const ownerPublicKey = new PublicKey("cCx8fugvvUFMEpuryqSzrDs6PBDCpXkorH7kodGbM5r")

    const mintPubkey = new PublicKey(SBTAddress)

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