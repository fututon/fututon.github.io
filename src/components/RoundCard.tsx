import { useTonConnect } from "@/hooks/useTonConnect";
import { usePredictRoundContract } from "@/hooks/usePredictRoundContract.ts";
import {Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { fromNano, toNano } from "ton-core";
import { useTonPrice } from "@/hooks/useTonPrice";
import CountdownTimer from "@/components/CountdownTimer";

export default function RoundCard({ contractAddress, status, startRoundAt, finishRoundAt }) {
  console.log("ROUND", contractAddress, startRoundAt, finishRoundAt)

  const { connected } = useTonConnect();
  const { roundInfo, playerInfo, sendPlaceUp, sendPlaceDown, sendWithdrawWinning } = usePredictRoundContract(contractAddress);
  const [bet, setBet] = useState(0);
  const { price } = useTonPrice();
  const prizeSum = roundInfo ? fromNano(roundInfo.upSum + roundInfo.downSum) : '';


  console.log("roundInfo", roundInfo)

  const renderPlayerBet = (direction) => {
    if (!playerInfo) return null
    if (playerInfo.betDirection !== direction) return null

    let amount = fromNano(playerInfo.betAmount)

    return (
      <div className="bg-primary-50 p-1 rounded-md">
        Yours {amount} TON
      </div>
    )
  }

  const renderUpDirection = () => {
    const upSum: number = roundInfo.upSum ? Number.parseFloat(fromNano(roundInfo.upSum)) : 0
    const downSum: number = roundInfo.downSum ? Number.parseFloat(fromNano(roundInfo.downSum)) : 0
    const sum = upSum + downSum

    let rate = 1
    if (upSum) {
      rate = Math.round(sum / upSum * 100) / 100
    }

    let klass = "border-2 w-[80%] text-center p-3 rounded-t-xl border-b-0 text-success relative"
    klass += roundInfo.roundDirection == 1 ? ' text-white bg-success' : ''
    return (
      <div className={klass}>
        <div className="absolute top-0 left-[-20px] text-sm">
          {renderPlayerBet(1)}
        </div>

        <div>UP</div>
        <div>x{rate}</div>
      </div>
    )
  }

  const renderDownDirection = () => {
    const upSum = roundInfo.upSum ? parseFloat(fromNano(roundInfo.upSum)) : 0
    const downSum = roundInfo.downSum ? parseFloat(fromNano(roundInfo.downSum)) : 0
    const sum = upSum + downSum

    let rate = 1
    if (downSum) {
      rate = Math.round(sum / downSum * 100) / 100
    }

    let klass = "border-2 w-[80%] text-center p-3 rounded-b-xl border-t-0 text-danger relative"
    klass += roundInfo.roundDirection == 2 ? ' text-white bg-danger' : ''
    return (
      <div className={klass}>
        <div className="absolute bottom-0 left-[-20px] text-sm">
          {renderPlayerBet(2)}
        </div>

        <div>x{rate}</div>
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
    if (new Date() > new Date(startRoundAt)) {
      return (
        <Card
          fullWidth={true}
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Betting</h4>
            <p>Round #{roundInfo.roundId}</p>
          </CardHeader>
          <Divider/>
          <CardBody className="overflow-visible py-2 flex flex-col items-center">
            {renderUpDirection()}

            <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
              <p className="text-tiny uppercase font-bold">
                STARTING
              </p>
            </div>

            {renderDownDirection()}
          </CardBody>
        </Card>
      )
    }

    let hasBet = playerInfo && playerInfo.betDirection > 0

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Betting <CountdownTimer targetDate={new Date(startRoundAt)} /></h4>
          <p>Round #{roundInfo.roundId}</p>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-4 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>

            {!hasBet &&
              <>
                <Input type="number" label="TON" onValueChange={v => setBet(Number.parseFloat(v))}/>

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
              </>
            }
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
          <p>Round #{roundInfo.roundId}</p>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-4 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase font-bold">Prize pool: {prizeSum} TON</p>
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  const renderStartedRound = () => {
    const startPrice = fromNano(roundInfo.startPrice);
    const priceKlass = Number.parseFloat(startPrice) < price ? 'text-success font-bold' : 'text-danger font-bold';

    if (new Date() > new Date(finishRoundAt)) {
      return (
        <Card
          fullWidth={true}
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Started</h4>
            <p>Round #{roundInfo.roundId}</p>
          </CardHeader>
          <Divider/>
          <CardBody className="overflow-visible py-2 flex flex-col items-center">
            {renderUpDirection()}

            <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full h-[200px] justify-center ">
              <p className="text-tiny uppercase font-bold">
                FINISHING
              </p>
            </div>

            {renderDownDirection()}
          </CardBody>
        </Card>
      )
    }

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Started <CountdownTimer targetDate={new Date(finishRoundAt)} /></h4>
          <p>Round #{roundInfo.roundId}</p>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-4 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase">Current price:</p>
            <p className={priceKlass}>{price} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="uppercase font-bold">Prize pool: {prizeSum} TON</p>
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  const renderFinishedRound = () => {
    const startPrice = fromNano(roundInfo.startPrice);
    const finishPrice = fromNano(roundInfo.finishPrice);
    const isWon = playerInfo && roundInfo && roundInfo.roundDirection === playerInfo.betDirection;
    const priceKlass = roundInfo.roundDirection === 1 ? 'text-success font-bold' : 'text-danger font-bold';

    return (
      <Card
        fullWidth={true}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Finished</h4>
          <p>Round #{roundInfo.roundId}</p>
        </CardHeader>
        <Divider/>
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          {renderUpDirection()}

          <div className="flex flex-col gap-1 p-4 border-2 rounded-xl w-full h-[200px] justify-center ">
            <p className="text-tiny uppercase">Finish price:</p>
            <p className={priceKlass}>{finishPrice} TON</p>

            <p className="text-tiny uppercase font-bold">Locked price: {startPrice} TON</p>
            <p className="uppercase font-bold">Prize pool: {prizeSum} TON</p>

            {isWon && !playerInfo.isClaimed &&
              <Button
                color="primary"
                isDisabled={!connected}
                onClick={() => {
                  sendWithdrawWinning();
                }}
              >
                Withdraw prize
              </Button>
            }

            {isWon && playerInfo.isClaimed &&
              <Button
                color="success"
                isDisabled={true}
              >
                Claimed
              </Button>
            }

            {!isWon &&
              <Button
                color="primary"
                isDisabled={true}
              >
                Not won
              </Button>
            }
          </div>

          {renderDownDirection()}
        </CardBody>
      </Card>
    )
  }

  if (roundInfo) {
    const roundState = roundInfo.roundState;

    if (status == "new") return renderNewRound();
    if (status == "betting_started") return renderStartedBetting();
    if (status == "betting_finished") return renderFinishedBetting();
    if (status == "round_started") return renderStartedRound();
    if (status == "round_finished") return renderFinishedRound();
  }

  return renderLoading();
}
