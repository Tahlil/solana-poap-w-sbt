import { SBTAddress, ATAAddress } from "./config.js";
import axios from "axios";
(async () => {
    // console.log(axios);
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
                "cCx8fugvvUFMEpuryqSzrDs6PBDCpXkorH7kodGbM5r",
                {
                  mint: SBTAddress,
                },
                {
                  encoding: "jsonParsed",
                },
              ],
            },
            
        ]
    });
    console.log(response.data[0].result.value[0].account.data.parsed);
    
})();

