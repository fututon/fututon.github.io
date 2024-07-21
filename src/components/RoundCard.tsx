import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import {usePredictRoundContract} from "@/hooks/usePredictRoundContract.ts";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import React, {useState} from "react";
import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react";

export default function RoundCard({ contractAddress }) {
  const { connected } = useTonConnect();
  const predictRoundContract = usePredictRoundContract(contractAddress);
  const [bet, setBet] = useState(0);

  return (
    <Card
      fullWidth={true}

    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">Live</h4>

        <div>
          <b>Address</b>
          <span>{predictRoundContract.address}</span>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="overflow-visible py-2 flex flex-col items-center">

        <div>
          UP {predictRoundContract.upSum ?? "Loading..."}
        </div>

        <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
          <p className="text-tiny uppercase font-bold">Prize pool: 300 TON</p>

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
