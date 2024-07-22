import PredictRound from "@/contracts/PredictRound";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano, fromNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function usePredictRoundContract(contractAddress: string) {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const contract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new PredictRound(Address.parse(contractAddress));
    return client.open(contract) as OpenedContract<PredictRound>;
  }, [client]);

  const { data: upSumValue, isFetching: isUpSumFetching } = useQuery(
    ["up_sum"],
    async () => {
      if (!contract) return null;
      return (await contract!.getUpSum()).toString();
    },
    { refetchInterval: 3000 }
  );

  const { data: downSumValue, isFetching: isDownSumFetching } = useQuery(
    ["down_sum"],
    async () => {
      if (!contract) return null;
      return (await contract!.getDownSum()).toString();
    },
    { refetchInterval: 3000 }
  );

  const { data: roundInfoValue, isFetching: isRoundInfoFetching } = useQuery(
    ["round_info"],
    async () => {
      if (!contract) return null;
      return await contract!.getRoundInfo();
    },
    { refetchInterval: 3000 }
  );

  return {
    address: contract?.address.toString(),
    upSum: upSumValue ? fromNano(upSumValue) : null,
    downSum: downSumValue ? fromNano(downSumValue) : null,
    roundInfo: roundInfoValue ? roundInfoValue : null,

    sendPlaceUp: (value) => {
      return contract?.sendPlaceUp(sender, {
        value: toNano(value.toString())
      });
    },
    sendPlaceDown: (value) => {
      return contract?.sendPlaceDown(sender, {
        value: toNano(value.toString())
      });
    },
    sendWithdrawWinning: () => {
      return contract?.sendWithdrawWinning(sender);
    }
  };
}
