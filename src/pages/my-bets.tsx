import DefaultLayout from "@/layouts/default";
import { useBetsWalletContract } from "@/hooks/useBetsWalletContract";
import Rounds from "@/components/Rounds";
import { title, subtitle } from "@/components/primitives";

export default function MyBetsPage() {
  // Как получить адрес контракта?

  const { rounds } = useBetsWalletContract('kQBQ-C0cDt2Y2JD9O0B6cHNr0soN5W8IPxM_xFFgZHEp882t')

  console.log("rounds", rounds)

  const renderRounds = () => {
    if (!rounds) return null

    let roundsData = rounds.map(address => ({
      contractAddress: address.toString(),
      status: "betting_started",
      nextAt: new Date().getTime()
    }))

    let contracts = rounds.map(i => i.toString())

    return (
      <Rounds
        contracts={contracts}
        // roundsData={roundsData}
        // loading={false}
      />
    )
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <h1 className={title()}>My Bets</h1>
        <div className="w-full flex flex-col gap-1">
          {renderRounds()}
        </div>
      </section>
    </DefaultLayout>
  );
}
