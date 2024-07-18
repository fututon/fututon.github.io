import PredictRound from "@/contracts/PredictRound.ts";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function usePredictRoundContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const contract = useAsyncInitialize(async () => {
    if (!client) return;

    const contractAddress = Address.parse(network === CHAIN.MAINNET
      ? ""
      : "kQBbia0VAWeRqFGNXgNvqRoZz9eame8RSP02GRQNPIw_QqzP")
    const contract = new PredictRound(contractAddress);
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

  return {
    address: contract?.address.toString(),
    upSum: isUpSumFetching ? null : upSumValue,
    downSum: isDownSumFetching ? null : downSumValue,

    sendPlaceUp: (value) => {
      return contract?.sendPlaceUp(sender, {
        increaseBy: value,
        value: toNano("0.005")
      });
    },
    sendPlaceDown: (value) => {
      return contract?.sendPlaceDown(sender, {
        increaseBy: value,
        value: toNano("0.005")
      });
    },
  };
}
