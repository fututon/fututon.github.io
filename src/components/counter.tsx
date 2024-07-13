import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

export default function Counter() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();


  return (
    <div className="Container">
          <h3>Counter</h3>
          <div>
            <b>Address</b>
            <span>{address}</span>
          </div>
          <div>
            <b>Value</b>
            <div>{value ?? "Loading..."}</div>
          </div>
          <button
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </button>
    </div>
  );
}
