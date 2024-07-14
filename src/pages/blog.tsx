import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

import React, {useState} from "react";
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
import Chart from "@/components/chart.tsx";
import Carousel from "react-multi-carousel";
import {Image} from "@nextui-org/image";

export default function DocsPage() {
  const [selected, setSelected] = useState("bets");
  let CarouselElement = null;

  const renderChart = () => {

    return (
      <Chart />
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
        partialVisibilityGutter: 30,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        partialVisibilityGutter: 30
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
          <Card className="py-4 m-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
          <Card className="py-4 m-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
          <Card className="py-4 m-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
          <Card className="py-4 m-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
          <Card className="py-4 m-1">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
        </Carousel>
      </div>

    )

  }


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full text-center justify-center">

          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={(val) => setSelected(val.toString())}
          >
            <Tab key="bets" title="Bets">
              {renderCarousel()}
            </Tab>
            <Tab key="chart" title="Chart">
              {renderChart()}
            </Tab>
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
