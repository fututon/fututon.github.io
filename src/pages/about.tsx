import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { Divider, Link } from "@nextui-org/react";
import Chart from "@/components/chart";
import Counter from "@/components/counter";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
              <h1 className={title()}>About</h1>

              {/*<Counter />*/}

              <div className="flex flex-row items-center justify-center gap-4">

                  <Card className="py-4">
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


                  <Card className="max-w-[400px]">
                      <CardHeader className="flex gap-3">
                          <Image
                              alt="nextui logo"
                              height={40}
                              radius="sm"
                              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                              width={40}
                          />
                          <div className="flex flex-col">
                              <p className="text-md">NextUI</p>
                              <p className="text-small text-default-500">nextui.org</p>
                          </div>
                      </CardHeader>
                      <Divider/>
                      <CardBody>
                          <p>Make beautiful websites regardless of your design experience.</p>
                      </CardBody>
                      <Divider/>
                      <CardFooter>
                          <Link
                              isExternal
                              showAnchorIcon
                              href="https://github.com/nextui-org/nextui"
                          >
                              Visit source code on GitHub.
                          </Link>
                      </CardFooter>
                  </Card>

              </div>

              <Chart />
          </div>
      </section>
    </DefaultLayout>
);
}
