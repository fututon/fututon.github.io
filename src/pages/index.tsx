import DefaultLayout from "@/layouts/default";
import { useQuery } from "@tanstack/react-query";
import Chart from "@/components/chart";
import Rounds from "@/components/Rounds";
import { title, subtitle } from "@/components/primitives";

export default function IndexPage() {
  const { data: contracts, isInitialLoading: isContractsInitialLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const url = import.meta.env.DEV ? 'http://localhost:5000/contracts' : 'https://flowbuilder.ru/contracts'
      const response = await fetch(url).catch(error => {
        console.log("ERRR")
        console.log(error)

        return new Response(JSON.stringify({
          code: 400,
          message: 'Stupid network Error'
        }));
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response.json()
    },
    refetchInterval: 3000
  });

  const renderChart = () => {
    return (
      <Chart />
    )
  }

  const renderCards = () => {
    let contractsData = contracts?.slice(-4) //.map(i => i.contractAddress)
    return (
      <Rounds
        contracts={contractsData}
      />
    )
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        {/*<h1 className={title()}>Home</h1>*/}
        <p className="p-4">Predict if the price of TONUSD will be higher or lower in next round - guess correctly to win!</p>
        {renderCards()}
        {renderChart()}
      </section>
    </DefaultLayout>
  );
}
