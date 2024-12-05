import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/utils/types";
import { useLoaderData } from "react-router-dom";

const WrapupEditCategory = () => {
  const categories = useLoaderData() as Category[];

  return (
    <div className="relative mt-10">
      <Carousel className="relative w-full max-w-xs">
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.category_id}>
              <div className="flex items-center justify-center p-4">
                <Card className="w-full max-w-[200px]">
                  <CardContent
                    className="flex flex-col items-center justify-center p-6"
                    style={{ backgroundColor: category.category_color }}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-white">
                        {category.category_name}
                      </h3>
                      <p className="mt-1 text-sm text-white">
                        Budget: ₱{category.budget}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default WrapupEditCategory;
