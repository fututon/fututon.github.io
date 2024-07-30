import { useQuery } from "@tanstack/react-query";

export function useTonPrice() {

  const getLastPrice = async () => {
    const url = import.meta.env.DEV ? "http://localhost:5000/api/ticker" : 'http://82.202.198.172:8964/api/ticker'
    let response = await fetch(url)
      .then(response => response.json())

    if (response.retMsg !== "OK") {
      return null
    }

    return Number.parseFloat(response.result.price);
  }

  const { data } = useQuery({
    queryKey: ["ton_price"],
    queryFn: async () => {
      return await getLastPrice()
    },
    refetchInterval: 2000
  });

  return {
    price: data
  }
}
