import RoundCard from "@/components/RoundCard";
import Carousel from "react-multi-carousel";
import {useEffect} from "react";
import {divider} from "@nextui-org/theme";

export default function Rounds({ contracts }) {
  let CarouselElement = null;

  useEffect(() => {
    console.log("23q3", CarouselElement)
    if (!CarouselElement) return
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
  };

  const renderCard = (contractAddress) => {
    return (
      <div className="p-1" key={contractAddress}>
        <RoundCard contractAddress={contractAddress} />
      </div>
    )
  }

  if (!contracts) return null

  console.log(contracts)

  // return (
  //   <div>
  //     {contracts.map(renderCard)}
  //   </div>
  // )

  return (
    <div className="w:100%">
      <Carousel
        ref={(el) => (CarouselElement = el)}
        arrows={false}
        responsive={responsive}
        swipeable={true}
        draggable={true}
        partialVisible={true}
        // centerMode={true}
        // focusOnSelect={true}
      >
        {contracts.map(renderCard)}
      </Carousel>
    </div>
  )
}
