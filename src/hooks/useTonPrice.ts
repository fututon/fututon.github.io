import {useQuery} from "@tanstack/react-query";

export function useTonPrice() {

  const getLastPrice = async () => {
    let response = await fetch("http://localhost:5000/api/ticker").then(response => response.json())

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
  };
}
