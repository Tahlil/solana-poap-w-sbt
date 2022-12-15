import type { NextApiRequest, NextApiResponse } from "next";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { SBTAddress } from "../../../../backend/config.js"
type Data = {
  tokenAddress: string;
  mintAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { userPublicKey } = req.query;
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
        userTokenAddress = account.value[0].pubkey.toString()
      }
      res.status(200).json({ tokenAddress: userTokenAddress, mintAddress: SBTAddress });
    }
  } else {
    res.status(400);
  }
}
