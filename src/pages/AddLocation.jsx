import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/MultipleImageUPload";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";

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

export default function AddLocationPage() {
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

  const onSubmit = async (data) => {
    try {
      // Format phone number
      if (data.phoneNumber.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }
      await axios.post(`${BASE_URL}/locations`, data);
       toast.success("Location added successfully!");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-lg p-8">
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
                <ImageUpload onUpload={(urls) => form.setValue("images", urls)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit">Add Location</Button>
        </form>
      </Form>
    </div>
  );
}
