import { useTonConnect } from "@/hooks/useTonConnect";
import { usePredictRoundContract } from "@/hooks/usePredictRoundContract.ts";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { useState } from "react";
import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import {fromNano, toNano} from "ton-core";
import {useTonPrice} from "@/hooks/useTonPrice";

export default function RoundCard({ contractAddress }) {
  const { connected } = useTonConnect();
  const { address, roundInfo, playerInfo, sendPlaceUp, sendPlaceDown, sendWithdrawWinning } = usePredictRoundContract(contractAddress);
  const [bet, setBet] = useState(0);
  const { price } = useTonPrice();

  const prizeSum = roundInfo ? fromNano(roundInfo.upSum + roundInfo.downSum) : '';

  const renderUpDirection = () => {
    const upSum = roundInfo.upSum ? fromNano(roundInfo.upSum) : 0
    let klass = "border-2 w-[80%] text-center p-2 rounded-t-xl border-b-0 text-success"
    klass += roundInfo.roundDirection == 1 ? ' text-white bg-success' : ''
    return (
      <div className={klass}>
        <div>UP</div>
        <div>{upSum}</div>
      </div>
    )
  }

  const renderDownDirection = () => {
    const downSum = roundInfo.downSum ? fromNano(roundInfo.downSum) : 0
    let klass = "border-2 w-[80%] text-center p-2 rounded-b-xl border-t-0 text-danger"
    klass += roundInfo.roundDirection == 2 ? ' text-white bg-danger' : ''
    return (
      <div className={klass}>
        <div>{downSum}</div>
        <div>DOWN</div>
      </div>
    )
  }

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
          <h4 className="font-bold text-large">Betting</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            <Input type="number" label="TON" onValueChange={v => setBet(Number.parseFloat(v))} />

            <Button
              color="success"
              isDisabled={!connected || bet <= 0}
              onClick={() => {
                sendPlaceUp(bet);
              }}
            >
              UP
            </Button>

            <Button
              color="danger"
              isDisabled={!connected || bet <= 0}
              onClick={() => {
                sendPlaceDown(bet);
              }}
            >
              DOWN
            </Button>
          </div>

          {renderDownDirection()}
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
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  const renderStartedRound = () => {
    const startPrice = fromNano(roundInfo.startPrice);

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Started</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="text-tiny uppercase font-bold">Current price price: {price} TON</p>
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  const renderFinishedRound = () => {
    const startPrice = fromNano(roundInfo.startPrice);
    const finishPrice = fromNano(roundInfo.finishPrice);

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Finished</h4>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="text-tiny uppercase font-bold">Finish price price: {finishPrice} TON</p>

            <Button
              color="primary"
              isDisabled={!connected}
              onClick={() => {
                sendWithdrawWinning();
              }}
            >
              Withdraw prize
            </Button>
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  if (roundInfo) {
    const roundState = roundInfo.roundState;
    if (roundState == 0) return renderNewRound();
    if (roundState == 1) return renderStartedBetting();
    if (roundState == 2) return renderFinishedBetting();
    if (roundState == 3) return renderStartedRound();
    if (roundState == 4) return renderFinishedRound();
  }

  return renderLoading();
}
