import type { NextApiRequest, NextApiResponse } from "next";
import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { SBTAddress, ATAAddress } from "../../../../backend/config.js"
import {
    TOKEN_2022_PROGRAM_ID,
    mintTo 
} from '@solana/spl-token';

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
      const { userPublicKey } = req.body;
      if (userPublicKey === null) {
        res.status(400);
      } else {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const accountPublicKey = new PublicKey(
  
          userPublicKey
        );
  
        const mintAccount = new PublicKey(
          SBTAddress
        );
        const account = await connection.getTokenAccountsByOwner(
          accountPublicKey,
          {
            mint: mintAccount,
          }
        );
        let userTokenAddress = "";
        if(account.value.length > 0 ){
          console.log("No need to create new token address");
            
          userTokenAddress = account.value[0].pubkey.toString()
          const mintAuthPrivateKey = process.env.NEXT_PUBLIC_MINT_AUTHORITY_PRIVATE_KEY
          const payerPrivateKey = process.env.NEXT_PUBLIC_PAYER_PRIVATE_KEY

          const feePayer = Keypair.fromSecretKey(
            bs58.decode(payerPrivateKey)
          );
          
          const mintAuthority = Keypair.fromSecretKey(
            bs58.decode(mintAuthPrivateKey)
          );
          console.log("mint Authority public key", mintAuthority.publicKey);
          
          const mintPubkey = new PublicKey(SBTAddress);
          
          const associatedTokenAccount = new PublicKey(userTokenAddress);
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
        
          res.status(200).json({ msg: "Token minted", sig: sig});

        }
        res.status(200).json({ msg: "No token address", sig: "" });
      }
    } else {
      res.status(400);
    }
  }
  