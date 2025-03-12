import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";

// Define validation schema
const formSchema = z.object({
  firstName: z.string().trim().min(1, "First Name is required"),
  lastName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(10, "Phone Number is required"),
  numberOfGuests: z.coerce.number().min(1, "At least 1 guest is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  message: z.string().optional(),
});

function Reservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with useForm
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      numberOfGuests: 1,
      date: "",
      time: "",
      message: "",
    },
  });

  const { handleSubmit, control, reset } = form;  

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (data.phoneNumber.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }
      
      const response = await fetch(`${BASE_URL}/reservations/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        return;
      }

      toast.success("Reservation request submitted.");
      reset();  
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="max-w-96 items-center">
            <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-8">
              {/* First Name */}
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

              {/* Last Name */}
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                </div>

              {/* Phone Number */}
              <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0912 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Guests */}
              <FormField
                control={control}
                name="numberOfGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-8">
                {/* Date */}
                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl className="w-fit">
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time */}
                <FormField
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time *</FormLabel>
                      <FormControl className="w-fit">
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional requests..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Submitting..." : "Place Reservation"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Reservation;
