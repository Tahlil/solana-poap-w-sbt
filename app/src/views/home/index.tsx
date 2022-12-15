// Next, React
import { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionSignature,
} from "@solana/web3.js";
import {
  createInitializeNonTransferableMintInstruction,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { notify } from "../../utils/notifications";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const [tokenAddress, setTokenAddress] = useState("")
  const [mintAddress, setMintAddress] = useState("")
  const [tokenBalance, setTokenBalance] = useState(0)
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const { publicKey, sendTransaction } = wallet;

  useEffect(() => {
    fetch('http://localhost:3000/api/getTokenAddress?userPublicKey='+publicKey)
      .then((res) => res.json())
      .then(async (data) => {
        setTokenAddress(data.tokenAddress)
        setMintAddress(data.mintAddress)
        const response = await axios({
          url: `https://api.devnet.solana.com`,
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: [
              {
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenAccountsByOwner",
                params: [
                  publicKey,
                  {
                    mint: mintAddress,
                  },
                  {
                    encoding: "jsonParsed",
                  },
                ],
              },
              
          ]
      });
     
      console.log(response.data[0].result.value[0].account.data.parsed.info.tokenAmount);
      let tokens = response.data[0].result.value;
      console.log(tokens[0]);
      
      for (const token of tokens) {
       if(token.pubkey === tokenAddress){
        console.log("Token address found");
        setTokenBalance(token.account.data.parsed.info.tokenAmount.amount)
       }
       
      }
      

      })
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  const mintOnClick = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }
    
    let signature: TransactionSignature = "";
    try {

    //   await connection.confirmTransaction(signature, "confirmed");
    //   console.log(signature);
    //   notify({
    //     type: "success",
    //     message: "Transaction successful!",
    //     txid: signature,
    //   });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, notify, connection, sendTransaction, wallet]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Scaffold Lite{" "}
          <span className="text-sm font-normal align-top text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h4 className="md:w-full text-center text-slate-300 my-2">
          <p>Simply the fastest way to get started.</p>
          Next.js, tailwind, wallet, web3.js, and more.
        </h4>
        <div className="max-w-md mx-auto mockup-code bg-primary p-6 my-2">
          <pre data-prefix=">">
            <code className="truncate">Start building on Solana </code>
          </pre>
        </div>
        <div className="text-center">
          <RequestAirdrop />
          {/* {wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>} */}
          {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}
        </div>
        <div>
          
        {tokenAddress==""  ? (
             <span className="text-red">Token Address Not found</span>
          ) : (
            <div>
              Token Address:  <span className="underline subpixel-antialiased font-bold text-lime-700" >{tokenAddress}</span>
              <br />
              Mint Address:  <span className="underline subpixel-antialiased font-bold text-amber-700" >{mintAddress}</span>
              <br />
              Current balance:  <span className="underline subpixel-antialiased font-bold text-teal-700" >{tokenBalance}</span>
            </div>
          )}
        </div>
       
        <button onClick={mintOnClick} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          Mint SBT
        </button>
      </div>
    </div>
  );
};
