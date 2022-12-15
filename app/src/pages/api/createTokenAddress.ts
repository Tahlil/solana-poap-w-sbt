import type { NextApiRequest, NextApiResponse } from "next";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import { SBTAddress } from "../../../../backend/config.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

import bs58 from "bs58";
type Data = {
  msg: string;
  sig: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    console.log("Req post");
    
    const { userPublicKey } = req.body;
    console.log("userPublicKey", userPublicKey);
    
    if (userPublicKey === null) {
      res.status(400);
    } else {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const payerPrivateKey = process.env.NEXT_PUBLIC_PAYER_PRIVATE_KEY;

      const feePayer = Keypair.fromSecretKey(bs58.decode(payerPrivateKey));
      console.log("SBTAddress", SBTAddress);
        
      const mintPubkey = new PublicKey(SBTAddress);
      console.log("mintPubkey", mintPubkey);
      let userKey = new PublicKey(userPublicKey)
      let ata = await getAssociatedTokenAddress(
        mintPubkey, // mint
        userKey, // owner
        false, // allow owner off curve
        TOKEN_2022_PROGRAM_ID
      );
      console.log(`ata: ${ata.toBase58()}`);

      let tx = new Transaction();
      tx.add(
        createAssociatedTokenAccountInstruction(
          feePayer.publicKey, // payer
          ata, // ata
          userKey, // owner
          mintPubkey, // mint
          TOKEN_2022_PROGRAM_ID
        )
      );
      const sig = await connection.sendTransaction(tx, [feePayer]);
      res.status(200).json({ msg: "Token address created", sig: sig.toString() });
    }
  } else {
    res.status(400);
  }
}
