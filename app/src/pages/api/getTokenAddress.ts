import type { NextApiRequest, NextApiResponse } from "next";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
type Data = {
  tokenAddress: string;
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
        "FXi8GKNvfzsDRnog68S1h4XaUaimygCYb1x4idGNg4o1"
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
      res.status(200).json({ tokenAddress: userTokenAddress });
    }
  } else {
    res.status(400);
  }
}
