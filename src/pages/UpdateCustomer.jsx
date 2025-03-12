import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";

// Define allowed subcities
const allowedSubcities = [
  "Addis Ketema",
  "Akaki Kaliti",
  "Arada",
  "Lemi Kura",
  "Bole",
  "Gullele",
  "Kirkos",
  "Kolfe Keranio",
  "Ledeta",
  "Nifas Silk Lafto",
  "Yeka",
];

// Define validation schema
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

const formSchema = z.object({
  firstName: z.string().trim().min(1, "First Name is required"),
  lastName: z.string().trim().optional(),
  phoneNumber: z.string().trim().refine(
    (value) => !value || /^(09\d{8}|\+2519\d{8})$/.test(value),
    { message: "Invalid phone number. Must start with '09' or '+2519' and have 10 or 12 digits." }
  ),
    
  email: z
    .string()
    .trim()
    .optional() // Email is optional
    .refine(
      (value) => !value || emailRegex.test(value), // Validate email if provided
      {
        message: "Please enter a valid email address",
      }
    )
    .transform((value) => (value === "" ? null : value)), // Convert empty string to null
  subcity: z
    .string()
    .trim()
    .optional() // Subcity is optional
    .refine(
      (value) => !value || allowedSubcities.includes(value), // Validate subcity if provided
      {
        message: "Please select a valid subcity",
      }
    ),
  area: z.string().trim().optional(),
});




function UpdateCustomer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { customerId } = useParams();

  // Initialize form with useForm
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      subcity: "",
      area: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Convert empty email to undefined (field will be omitted)
      if (!data.email || data.email.trim() === "") {
        delete data.email; // Remove the email field entirely
      }

      // Convert empty subcity to null
      if (!data.subcity || data.subcity.trim() === "") {
        data.subcity = null;
      }

      // Format phone number
      if (data.phoneNumber.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }

      // Send data to the backend
      const response = await fetch(`${BASE_URL}/users/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        return;
      }
      toast.success("Customer updated successfully.");
      navigate(-1);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch customer data on component mount
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${customerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseJson = await response.json();
        const customer = responseJson.data.customer;

        // Format the data for the form
        form.reset({
          firstName: customer?.firstName || "",
          lastName: customer?.lastName || "",
          phoneNumber: customer?.phoneNumber || "",
          email: customer?.email || "",
          subcity: !customer?.subcity || customer?.subcity === "N/A" ? "" : customer?.subcity,
          area: !customer?.area || customer?.area === "N/A" ? "" : customer?.area,
        });
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [customerId, form]);


  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="max-w-[450px] items-center">
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

              {/* Email */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subcity (DropdownMenu from ShadCN) */}
              <div className="grid grid-cols-2 gap-8">
                <FormField
                  control={control}
                  name="subcity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcity (Optional)</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-48 text-sm p-2 border rounded-md flex items-center justify-between">
                              {field.value || "Select Subcity"}
                              <ArrowDown size={18} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Select a Subcity</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allowedSubcities.map((subcity) => (
                              <DropdownMenuItem
                                key={subcity}
                                onClick={() => field.onChange(subcity)}
                              >
                                {subcity}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Area */}
                <FormField
                  control={control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area *</FormLabel>
                      <FormControl>
                        <Input placeholder="Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Submitting..." : "Update Customer"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UpdateCustomer;