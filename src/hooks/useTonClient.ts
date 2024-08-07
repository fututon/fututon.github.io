import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useState } from "react";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export function useTonClient() {
  const { network } = useTonConnect();

  return {
    client: useAsyncInitialize(async () => {
      if (!network) return;

      let isTestnet = network === CHAIN.TESTNET
      // let apiKey = isTestnet ? "678bcc9d064ca914d92cb2f6a35f48ff85b5d7d5fdafd5d5b2b9bdd5a589fd44" : "a0a8125a6896800e76aa8aed2533968da41115a42c530fc24e68944fc46377d7"
      // let endpoint = `https://${isTestnet ? "testnet." : ""}toncenter.com/api/v2/jsonRPC?api_key=${apiKey}`

      let endpoint = await getHttpEndpoint({
        network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      })

      return new TonClient({ endpoint: endpoint });
    }, [network]),
  };
}
