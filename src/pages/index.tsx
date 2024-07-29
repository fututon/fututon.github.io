import DefaultLayout from "@/layouts/default";
import { useQuery } from "@tanstack/react-query";
import Chart from "@/components/chart";
import Rounds from "@/components/Rounds";
import CountdownTimer from "@/components/CountdownTimer";

export default function IndexPage() {
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


  function getNextFiveMinuteInterval() {
    const intervalMin = 3

    const now = new Date();
    const nextFiveMinutes = new Date(now);

    // Устанавливаем минуты на ближайшее кратное 5
    nextFiveMinutes.setMinutes(Math.ceil(now.getMinutes() / intervalMin) * intervalMin);
    nextFiveMinutes.setSeconds(0);
    nextFiveMinutes.setMilliseconds(0);

    // Если ближайший интервал равен текущему времени, добавляем 5 минут
    if (nextFiveMinutes <= now) {
      nextFiveMinutes.setMinutes(nextFiveMinutes.getMinutes() + intervalMin);
    }

    return nextFiveMinutes;
  }

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

  const renderCountdown = () => {
    return (
      <CountdownTimer targetDate={getNextFiveMinuteInterval()}/>
    )
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-1">
          {renderCountdown()}

          {renderCards()}
          {renderChart()}
        </div>
      </section>
    </DefaultLayout>
  );
}
