import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

import React, {useMemo, useState} from "react";
import {Tabs, Tab, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import Chart from "@/components/chart.tsx";
import Carousel from "react-multi-carousel";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button";

export default function DocsPage() {
  const [selected, setSelected] = useState("bets");
  let CarouselElement = null;


  const MemoChart = useMemo(() => {

    console.log('MEMO')

    // Это ваш компонент или элемент, который вы хотите рендерить и кэшировать
    return <Chart />;
  }, []);

  const renderChart = () => {

    console.log("RENDER")

    return (
      <Chart />
    )
  }

  const renderCard = () => {
    return (
      <div className="p-1">
        <Card
          fullWidth={true}

          >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Live</h4>
          </CardHeader>
          <Divider/>
          <CardBody className="overflow-visible py-2 flex flex-col items-center">

            <div>
              UP 2x
            </div>

            <div className="flex flex-col gap-1 p-2 border-2 rounded-xl w-full">
              <p className="text-tiny uppercase font-bold">Prize pool: 300 TON</p>
              <Button color="success">LONG</Button>
              <Button color="danger">SHORT</Button>
            </div>

            <div>
              DOWN 2x
            </div>

          </CardBody>

        </Card>
      </div>

    )
  }

  const renderCarousel = () => {
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
        partialVisibilityGutter: 20
      }
    };

    return (
      <div className="w:100%">
        <Carousel
          ref={(el) => (CarouselElement = el)}
          responsive={responsive}
          swipeable={true}
          draggable={true}
          // partialVisible={true}
          centerMode={true}
          focusOnSelect={true}
        >
          {renderCard()}
          {renderCard()}
          {renderCard()}
          {renderCard()}
          {renderCard()}
          {renderCard()}
        </Carousel>
      </div>

    )

  }


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-1">


          {renderCarousel()}

          {MemoChart}

        </div>
      </section>
    </DefaultLayout>
  );
}
