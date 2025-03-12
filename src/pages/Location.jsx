import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { BASE_URL } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

function Location() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/locations`);
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4   ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>
        <Button className="flex gap-2" onClick={() => navigate("add-location")}>
          <PlusCircle size={20} />
          Add Location
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3  gap-6">
        {locations?.map((loc) => (
          <Card key={loc?._id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{loc?.name}</CardTitle>
              <CardDescription>{loc?.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {loc?.images?.map((img, index) => (
                      <CarouselItem key={index} className="w-full h-48">
                        <img src={img} alt={`Location ${index}`} className="w-full h-full object-cover rounded-lg" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full">
                    <ChevronLeft size={20} />
                  </CarouselPrevious>
                  <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full">
                    <ChevronRight size={20} />
                  </CarouselNext>
                </Carousel>
              </div>
              <p className="mt-3 text-gray-600">{loc?.description}</p>
              <p className="mt-3 text-gray-600">{loc?.phoneNumber}</p>
              <Link to={`${loc?._id}/update`} className="text-blue-600 mt-2 block">
                Edit
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Location;
