import BetsWallet from "@/contracts/BetsWallet";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano, fromNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";
import { useTonAddress } from "@tonconnect/ui-react";

export function useBetsWalletContract(contractAddress: string) {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();
  const address = useTonAddress()

  const contract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new BetsWallet(Address.parse(contractAddress));
    return client.open(contract) as OpenedContract<BetsWallet>;
  }, [client]);

  console.log("contractAddress", contractAddress)

  const { data: roundsValue } = useQuery({
    queryKey: ["rounds " + contractAddress],
    queryFn: async () => {
      console.log("SAASA", contract)
      if (!contract) return null;

      return await contract!.getRounds();
    },
    refetchInterval: 2000 + Math.random() * 1000
  });

  return {
    address: contract?.address.toString(),
    rounds: roundsValue,
  };
}
