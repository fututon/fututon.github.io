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


  console.log(predictRoundContract)

  const prizeSum = predictRoundContract.roundInfo ? fromNano(predictRoundContract.roundInfo[2] + predictRoundContract.roundInfo[3]) : '';

  const renderLoading = () => {
    return (
      <Card
        fullWidth={true}
      >
        Loading...
      </Card>
    )
  }

  const renderNewRound = () => {
    return (
      <Card
        fullWidth={true}
      >
        later
      </Card>
    )
  }

  const renderStartedBetting = () => {
    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Next</h4>
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
  }

  const renderFinishedBetting = () => {
    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Starting...</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">

          <div>
            UP {predictRoundContract.upSum ?? "Loading..."}
          </div>

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>
          </div>

          <div>
            DOWN {predictRoundContract.downSum ?? "Loading..."}
          </div>
        </CardBody>
      </Card>
    )
  }

  const renderStartedRound = () => {
    const startPrice = fromNano(predictRoundContract.roundInfo[4]);

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Live</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          <div>
            UP {predictRoundContract.upSum ?? "Loading..."}
          </div>

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="text-tiny uppercase font-bold">Current price price: ?? TON</p>
          </div>

          <div>
            DOWN {predictRoundContract.downSum ?? "Loading..."}
          </div>
        </CardBody>
      </Card>
    )
  }

  const renderFinishedRound = () => {
    const startPrice = fromNano(predictRoundContract.roundInfo[4]);
    const finishPrice = fromNano(predictRoundContract.roundInfo[5]);

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Live</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          <div>
            UP {predictRoundContract.upSum ?? "Loading..."}
          </div>

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="text-tiny uppercase font-bold">Finish price price: {finishPrice} TON</p>

            <Button
              color="primary"
              isDisabled={!connected}
              onClick={() => {
                predictRoundContract.sendWithdrawWinning();
              }}
            >
              Withdraw prize
            </Button>
          </div>

          <div>
            DOWN {predictRoundContract.downSum ?? "Loading..."}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (predictRoundContract.roundInfo) {
    const roundState = predictRoundContract.roundInfo[1];

    if (roundState == 0) return renderNewRound();
    if (roundState == 1) return renderStartedBetting();
    if (roundState == 2) return renderFinishedBetting();
    if (roundState == 3) return renderStartedRound();
    if (roundState == 4) return renderFinishedRound();
  }

  return renderLoading();
}
