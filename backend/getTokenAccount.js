import {
    clusterApiUrl,
    Connection,
    PublicKey
} from '@solana/web3.js';

import { SBTAddress } from "./config.js";

(async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const accountPublicKey = new PublicKey(
        "cCx8fugvvUFMEpuryqSzrDs6PBDCpXkorH7kodGbM5r"
      );

    const mintAccount = new PublicKey(
        SBTAddress
      );
    const account = await connection.getTokenAccountsByOwner(accountPublicKey, {
          mint: mintAccount});
    
    console.log(account.value[0].pubkey.toString());
})();

