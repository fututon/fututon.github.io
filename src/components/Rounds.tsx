import RoundCard from "@/components/RoundCard"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {useEffect} from "react"
import { divider } from "@nextui-org/theme"
import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react";

export default function Rounds({ contracts }) {
  // let contracts = ["EQBpyjKt_fPj1xiW6DZtx-wTElOm5tTjVJRidGWGxX_HULs1", "EQDug4F3XdsHZreoErShryeWMNm3nZ6tBJxE46TQBQAZMO9t", "EQATR8F96n056wBKbaXw4QHiPqlQR-hivpGN3dMVTDBHwULg"]
  let carouselElement = null

  useEffect(() => {
    if (!carouselElement) return
    carouselElement.goToSlide(contracts.length - 1)
  }, [contracts])

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      partialVisibilityGutter: 50
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 50
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20
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

  const renderNextRound = () => {
    return (
      <div className="p-1">
        <Card
          fullWidth={true}
        >
          <CardBody className="py-20 flex flex-col items-center justify-center h-full">
            Next round soon...
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!contracts) return null

  return (
    <div className="min-h-[410px] w-full">
      <Carousel
        ref={(el) => (carouselElement = el)}
        arrows={true}
        responsive={responsive}
        swipeable={true}
        draggable={true}
        partialVisible={true}
        // centerMode={true}
        additionalTransfrom={10}
        // focusOnSelect={true}
      >
        {contracts.map(renderCard)}
        {renderNextRound()}
      </Carousel>
    </div>
  )
}
