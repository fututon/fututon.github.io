import DefaultLayout from "@/layouts/default";
import Chart from "@/components/chart.tsx";
import {useQuery} from "@tanstack/react-query";
import Rounds from "@/components/Rounds";

export default function DocsPage() {
  const { data: contracts, isInitialLoading: isContractsInitialLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/contracts')

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response.json()
    },
    refetchInterval: 3000
  });

  const renderChart = () => {
    console.log("RENDER chart")

    return (
      <Chart />
    )
  }

  const renderCards = () => {
    return (
      <Rounds
        contracts={contracts}
        loading={isContractsInitialLoading}
      />
    )
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-1">
          {renderCards()}
          {renderChart()}
        </div>
      </section>
    </DefaultLayout>
  );
}
