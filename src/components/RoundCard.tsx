import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import {usePredictRoundContract} from "@/hooks/usePredictRoundContract.ts";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import React, {useState} from "react";
import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import {fromNano} from "ton-core";

export default function RoundCard({ contractAddress }) {
  const { connected } = useTonConnect();
  const predictRoundContract = usePredictRoundContract(contractAddress);
  const [bet, setBet] = useState(0);

  console.log("predictRoundContract", predictRoundContract)

  const stateToStr = (state) => {
    if (state == 0) return 'Новый';
    if (state == 1) return 'Ставки принимаются';
    if (state == 2) return 'Ставки завершены';
    if (state == 3) return 'Раунд начат';
    if (state == 4) return 'Раунд завершен';
    return 'Неизвестный'
  }

  const prizeSum = predictRoundContract.roundInfo ? fromNano(predictRoundContract.roundInfo[2] +predictRoundContract.roundInfo[3]) : '';
  const stateStr = predictRoundContract.roundInfo ? stateToStr(predictRoundContract?.roundInfo[1]) : '';

  return (
    <Card
      fullWidth={true}
    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">Live</h4>

        <div>
          <div>Address: {predictRoundContract.address}</div>
          <div>State: {stateStr}</div>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="overflow-visible py-2 flex flex-col items-center">

        <div>
          UP {predictRoundContract.upSum ?? "Loading..."}
        </div>

        <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
          <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

          <Input type="number" label="TON" onValueChange={v => setBet(Number.parseFloat(v))} />

          <Button
            color="success"
            isDisabled={!connected || bet <= 0}
            onClick={() => {
              predictRoundContract.sendPlaceUp(bet);
            }}
          >
            UP
          </Button>

          <Button
            color="danger"
            isDisabled={!connected || bet <= 0}
            onClick={() => {
              predictRoundContract.sendPlaceDown(bet);
            }}
          >
            DOWN
          </Button>
        </div>

        <div>
          DOWN {predictRoundContract.downSum ?? "Loading..."}
        </div>

      </CardBody>

    </Card>
  )


  // return (
  //   <div className="Container">
  //     <h3>Counter</h3>
  //
  //     <div>
  //       <b>Wallet balance</b>
  //     </div>
  //
  //     <div>
  //       <b>Address</b>
  //       <span>{predictRoundContract.address}</span>
  //     </div>
  //
  //     <div>
  //       <b>Up Sum</b>
  //       <div>{predictRoundContract.upSum ?? "Loading..."}</div>
  //     </div>
  //
  //     <div>
  //       <b>Down Sum</b>
  //       <div>{predictRoundContract.downSum ?? "Loading..."}</div>
  //     </div>
  //
  //     <Input type="number" label="TON" onValueChange={v => setBet(Number.parseFloat(v))} />
  //
  //     <Button
  //       color="success"
  //       disabled={!connected || bet <= 0}
  //       className={`Button ${connected ? "Active" : "Disabled"}`}
  //       onClick={() => {
  //         predictRoundContract.sendPlaceUp(bet);
  //       }}
  //     >
  //       UP
  //     </Button>
  //
  //     <Button
  //       color="danger"
  //       disabled={!connected || bet <= 0}
  //       className={`Button ${connected ? "Active" : "Disabled"}`}
  //       onClick={() => {
  //         predictRoundContract.sendPlaceDown(bet);
  //       }}
  //     >
  //       DOWN
  //     </Button>
  //   </div>
  // );
}
