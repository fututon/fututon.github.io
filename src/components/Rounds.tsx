import RoundCard from "@/components/RoundCard"
import Carousel from "react-multi-carousel"
import {useEffect} from "react"
import { divider } from "@nextui-org/theme"

import 'react-multi-carousel/lib/styles.css';

export default function Rounds({ roundsData, loading }) {

  //
  // contracts = ["EQBpyjKt_fPj1xiW6DZtx-wTElOm5tTjVJRidGWGxX_HULs1", "EQDug4F3XdsHZreoErShryeWMNm3nZ6tBJxE46TQBQAZMO9t", "EQATR8F96n056wBKbaXw4QHiPqlQR-hivpGN3dMVTDBHwULg"]

  roundsData = [
    // {
    //   contractAddress: "kQBxrAA9TRzraFU0N0hrlxabL2TQ63yxBSoUS-Pj4L8I2V5x",
    //   status: "betting_started", // new, betting_started, betting_finished, round_started, round_finished
    //   nextAt: new Date().getTime()
    // },
    // {
    //   contractAddress: "EQAkPigEEypo2kWTfj5Y4wOQv7tMR5EmzRs2oRWr-GjU-DBY",
    //   status: "betting_started",
    //   nextAt: new Date().getTime()
    // },
    {
      contractAddress: "EQBAI3FmdMlMKZezOrPmqMq-wlcQzrIRUdb9HsFJy09f-zUH",
      status: "betting_started",
      nextAt: new Date().getTime()
    },

    // {
    //   contractAddress: "kQAjays_OI7BoEpK8w9tfKrvQGN2Q-7DmJzMsfNh3vxK7gd2",
    //   status: 'betting_started',
    //   nextAt: new Date().getTime()
    // }
  ]
  console.log("roundsData", roundsData)

  let carouselElement = null

  useEffect(() => {
    console.log("23q3", carouselElement)
    if (!carouselElement) return
    // CarouselElement.goToSlide(contracts.length - 1)
  }, [])

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 50
    }
  }

  const renderCard = (roundData) => {
    return (
      <div className="p-1" key={roundData.contractAddress}>
        <RoundCard
          contractAddress={roundData.contractAddress}
          status={roundData.status}
          startRoundAt={roundData.startRoundAt}
          finishRoundAt={roundData.finishRoundAt}
        />
      </div>
    )
  }

  if (!roundsData) return null

  return (
    <div className="min-h-[410px] w-full">
      <Carousel
        ref={(el) => (carouselElement = el)}
        arrows={false}
        responsive={responsive}
        swipeable={true}
        draggable={true}
        partialVisible={true}
        // centerMode={true}
        // focusOnSelect={true}
      >
        {roundsData.map(renderCard)}
      </Carousel>
    </div>
  )
}
