import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import eruda from 'eruda';
import {Button} from "@nextui-org/button";

export default function DocsPage() {
  const onClick = () => {
    console.log(123)
    eruda.init()
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>

          <Button onClick={onClick}>CL</Button>

        </div>
      </section>
    </DefaultLayout>
  );
}
