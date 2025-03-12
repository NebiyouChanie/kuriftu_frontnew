import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

export function NearbyCarousel({ pharmacies }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full overflow-hidden" // Prevent horizontal scrolling
    >
      <CarouselContent className="flex w-full">
        {pharmacies.map((pharmacy, index) => (
          <CarouselItem 
            key={index} 
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/6" // Full width for mobile
          >
            <div className="p-2">
            <Link
            to={`/pharmacy-profile/${pharmacy._id}`}
            >
              <Card>
                <CardContent
                  className="flex aspect-square items-center justify-center p-6 rounded relative"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1)), url(${pharmacy.pharmacyImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  >
                  <p className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                    {pharmacy.name.length > 15 ? pharmacy.name.substring(0, 15) + "..." : pharmacy.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
