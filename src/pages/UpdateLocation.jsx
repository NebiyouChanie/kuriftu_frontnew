import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "../components/MultipleImageUpload";
import { BASE_URL } from "@/lib/utils";

const locationSchema = z.object({
  name: z.string().min(2, "Location name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  address: z.string().min(3, "Address is required"),
  googleMapsLink: z.string().url("Enter a valid Google Maps link"),
  images: z.array(z.string()).max(10, "You can upload up to 10 images"),
  phoneNumber: z.string().trim().refine(
    (value) => !value || /^(09\d{8}|\+2519\d{8})$/.test(value),
    { message: "Invalid phone number. Must start with '09' or '+2519' and have 10 or 12 digits." }
  ),
});

export default function UpdateLocation() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phoneNumber: "",
      googleMapsLink: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/locations/${locationId}`);
        const location = response.data.data;
        form.reset({
          name: location?.name,
          description: location.description,
          address: location?.address,
          phoneNumber: location?.phoneNumber,
          googleMapsLink: location?.googleMapsLink,
          images: location?.images || [],
        });
      } catch (error) {
        toast.error("Failed to load location data");
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId, form]);

  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    try {
      // Format phone number
      if (data.phoneNumber.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }
      await axios.patch(`${BASE_URL}/locations/${locationId}`, data);
      toast.success("Location updated successfully!");
      navigate("/locations");
    } catch (error) {
      toast.error("Failed to update location");
      console.error("Error updating location:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg p-8">
      <h1 className="text-xl font-bold mb-4">Update Location</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="address" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="phoneNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="googleMapsLink" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Google Maps Link</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="images" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <FormControl>
                <ImageUpload 
                  onUpload={(urls) => form.setValue("images", urls)} 
                  initialImages={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit">Update Location</Button>
        </form>
      </Form>
    </div>
  );
}
