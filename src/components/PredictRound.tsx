import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import {usePredictRoundContract} from "@/hooks/usePredictRoundContract.ts";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {useState} from "react";

export default function PredictRound() {
  const { connected } = useTonConnect();
  const predictRoundContract = usePredictRoundContract();
  const [bet, setBet] = useState(0);

  return (
    <div className="Container">
      <h3>Counter</h3>

      <div>
        <b>Wallet balance</b>
      </div>

      <div>
        <b>Address</b>
        <span>{predictRoundContract.address}</span>
      </div>

      <div>
        <b>Up Sum</b>
        <div>{predictRoundContract.upSum ?? "Loading..."}</div>
      </div>

      <div>
        <b>Down Sum</b>
        <div>{predictRoundContract.downSum ?? "Loading..."}</div>
      </div>

      <Input type="number" label="TON" onValueChange={v => setBet(Number.parseFloat(v))} />

      <Button
        color="success"
        disabled={!connected || bet <= 0}
        className={`Button ${connected ? "Active" : "Disabled"}`}
        onClick={() => {
          predictRoundContract.sendPlaceUp(bet);
        }}
      >
        UP
      </Button>

      <Button
        color="danger"
        disabled={!connected || bet <= 0}
        className={`Button ${connected ? "Active" : "Disabled"}`}
        onClick={() => {
          predictRoundContract.sendPlaceDown(bet);
        }}
      >
        DOWN
      </Button>
    </div>
  );
}
