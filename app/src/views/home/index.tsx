// Next, React
import { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Loader from "../../components/Loader";
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
  const [tokenAddress, setTokenAddress] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loaded, setLoaded] = useState(true);
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const { publicKey, sendTransaction } = wallet;

  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  async function getCurrentBalance() {
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
      ],
    });

    // console.log(response.data[0].result.value[0].account.data.parsed.info.tokenAmount);
    let tokens = response.data[0].result.value;
    console.log(tokens[0]);

    for (const token of tokens) {
      if (token.pubkey === tokenAddress) {
        console.log("Token address found...");
        console.log(token.account.data.parsed.info.tokenAmount.amount);
        
        setTokenBalance(token.account.data.parsed.info.tokenAmount.amount);
        console.log(tokenBalance);
        
      }
    }
  }

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
      fetch(
        "http://localhost:3000/api/getTokenAddress?userPublicKey=" + publicKey
      )
        .then((res) => res.json())
        .then(async (data) => {
          setTokenAddress(data.tokenAddress);
          setMintAddress(data.mintAddress);
          await getCurrentBalance();
        });
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  const mintOnClick = useCallback(async () => {
    console.log("Clicked");

    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: TransactionSignature = "";
    try {
      setLoaded(false);
      const res = await fetch("http://localhost:3000/api/mintToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPublicKey: publicKey }),
      });
      const data = await res.json();

      await sleep(3000);
      await getCurrentBalance()
      // setTokenBalance(tokenBalance+1);
      // console.log(data);
      
      setLoaded(true);


      //   await connection.confirmTransaction(signature, "confirmed");
      // console.log(signature);
      notify({
        type: "success",
        message:
          "Transaction successful!\n Check the tx: \n https://explorer.solana.com/tx/" +
          data.sig +
          "?cluster=devnet",
        txid: data.sig,
      });
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
      {!loaded ? (
         <Loader />
      ) : (
        <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          P. O. A. P.{" "}
          <span className="text-sm font-normal align-top text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h4 className="md:w-full text-center text-slate-300 my-2">
          App
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
          <div className="mx-auto bg-gray-700 h-screen flex flex-wrap  items-center justify-center">
            <div className="flex flex-col w-full bg-white rounded shadow-lg sm:w-3/4 md:w-1/2 lg:w-3/5">
              <div className="w-full h-64 bg-top bg-cover rounded-t bg-[url('https://dailyhodl.com/wp-content/uploads/2021/11/solana-users-browser.jpg')]"></div>
              <div className="flex flex-col w-full md:flex-row">
                <div className="flex flex-row justify-around p-4 font-bold leading-none text-gray-800 uppercase bg-gray-400 rounded md:flex-col md:items-center md:justify-center md:w-1/4">
                  <div className="md:text-3xl">Jan</div>
                  <div className="md:text-6xl">13</div>
                  <div className="md:text-xl">7 pm</div>
                </div>
                <div className="p-4 font-normal text-gray-800 md:w-3/4">
                  <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-800">
                    2022 Solana Event
                  </h1>
                  <p className="leading-normal">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Aspernatur, aut nobis. Doloribus similique neque fugiat
                    commodi nemo, ipsum eius odio dolores. Porro doloribus amet
                    possimus.
                  </p>
                  <div className="flex flex-row items-center mt-4 text-gray-700">
                    <div className="w-1/2">Mercedes-Benz Superdome</div>
                    <div className="w-1/2 flex justify-end">
                      <img
                        src="https://collegefootballplayoff.com/images/section_logo.png"
                        alt=""
                        className="w-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {tokenAddress == "" ? (
                <span className="text-red">Token Address Not found</span>
              ) : (
                <div>
                  Token Address:{" "}
                  <span className="underline subpixel-antialiased font-bold text-lime-700 text-lg">
                    {tokenAddress}
                  </span>
                  <br />
                  Mint Address:{" "}
                  <span className="underline subpixel-antialiased font-bold text-amber-700 text-lg">
                    {mintAddress}
                  </span>
                  <br />
                  Number Of Tickets:{" "}
                  <span className="underline subpixel-antialiased font-bold text-teal-700 text-3xl">
                    {tokenBalance}
                  </span>
                </div>
              )}

              <button
                onClick={mintOnClick}
                className="m-3 bg-transparent hover:bg-teal-500 text-teal-300 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Mint SBT / Buy Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      
    </div>
  );
};
