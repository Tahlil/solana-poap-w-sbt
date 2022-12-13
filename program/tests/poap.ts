import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Poap } from "../target/types/poap";

describe("poap", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Poap as Program<Poap>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
