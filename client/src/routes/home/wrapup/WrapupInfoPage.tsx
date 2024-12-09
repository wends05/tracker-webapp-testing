import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const WrapupInfoPage = () => {
  return (
    <div className="overflow-hidden">
      <div className="ml-5 mt-3 text-4xl font-bold">Week-End Review</div>
      <hr className="ml-6 mr-6 mt-3 border-t-2 border-slate-950" />
      <div className="ml-8 mt-3 flex gap-80">
        <div>
          <h4 className="text-lg font-medium">Summary of Expenses</h4>
          <div className="h-[15rem] w-[30rem] bg-slate-700 text-white">
            insert ang graph here
          </div>
          <div className="ml-2 mt-3">
            <h4 className="text-lg font-medium">
              From a total budget of *insert tot budget* this week
            </h4>

            <div className="mt-7 flex gap-12 font-semibold">
              <div>
                <h3 className="font-semibold">You saved</h3>
                <br></br>
                <h4 className="text-lime-600">*insert saved here*</h4>
                <br></br>
                <h4>*percent* of your budget</h4>
              </div>

              <div>
                <h3 className="font-semibold">You spent</h3>
                <br></br>
                <h4 className="text-red-700">*insert spent*</h4>
                <br></br>
                <h4>*percent* of your budget</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-4 text-lg font-medium">
            Your most spent categories
          </h4>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-lg overflow-visible"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-36">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="mt-6">
            <h4 className="mb-4 text-lg font-medium">Your highest expenses</h4>
            <div className="h-[10rem] w-[30rem] bg-slate-700 text-white">
              insert ang expenses here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapupInfoPage;
