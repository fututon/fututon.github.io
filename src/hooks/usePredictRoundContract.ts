import PredictRound from "@/contracts/PredictRound";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano, fromNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";
import { useTonAddress } from "@tonconnect/ui-react";

export function usePredictRoundContract(contractAddress: string) {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();
  const address = useTonAddress()
  const contract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new PredictRound(Address.parse(contractAddress));
    return client.open(contract) as OpenedContract<PredictRound>;
  }, [client]);

  const { data: roundInfoValue } = useQuery({
    queryKey: ["round_info " + contractAddress],
    queryFn: async () => {
      if (!contract) return null;
      return await contract!.getRoundInfo();
    },
    refetchInterval: 2000 + Math.random() * 1000
  });

  console.log(2000 + Math.random() * 1000)

  const { data: playerInfoValue } = useQuery({
    queryKey: ["player_info " + contractAddress],
    queryFn: async () => {
      if (!contract) return null;
      if (!address) return null;
      return await contract!.getPlayerInfo(Address.parse(address));
    },
    refetchInterval: 2000 + Math.random() * 1000
  });

  return {
    address: contract?.address.toString(),
    roundInfo: roundInfoValue,
    playerInfo: playerInfoValue,

    sendPlaceUp: (value: number) => {
      return contract?.sendPlaceUp(sender, {
        bet_amount: toNano(value.toString())
      });
    },
    sendPlaceDown: (value: number) => {
      return contract?.sendPlaceDown(sender, {
        bet_amount: toNano(value.toString())
      });
    },
    sendWithdrawWinning: () => {
      return contract?.sendWithdrawWinning(sender);
    }
  };
}
