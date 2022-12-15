import {
    clusterApiUrl,
    sendAndConfirmTransaction,
    Connection,
    PublicKey
} from '@solana/web3.js';
import {
    createMintToCheckedInstruction
} from '@solana/spl-token';
import { SBTAddress } from "./config.js";


// connection
const connection = new Connection("https://api.devnet.solana.com");

// 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
const feePayer = Keypair.fromSecretKey(
  bs58.decode("588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2")
);

// G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
const mintAuthority = Keypair.fromSecretKey(
  bs58.decode("4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp")
);

const mintPubkey = new PublicKey(SBTAddress);

const tokenAccount1Pubkey = new PublicKey("37sAdhEFiYxKnQAm7CPd5GLK1ZxWovqn3p87kKjfD44c");



// mint token

(async () => {
  let tx = new Transaction();
  tx.add(
    createMintToCheckedInstruction(
      mintPubkey,
      tokenAccount1Pubkey,
      mintAuthority.publicKey, // mint auth
      1, // amount
      0 // decimals
    )
  );
  console.log(`txhash: ${await connection.sendTransaction(tx, [feePayer, mintAuthority])}`);
})();
