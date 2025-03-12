import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";  
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from "../components/ImageUpload"; 
import Dropdown from "../components/Dropdown"; 
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";

// Define the validation schema using Zod
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be a positive number")),
  category: z.string().trim().min(1, "Category is required"),
  isSpecial: z.boolean().optional(),
  isMainMenu: z.boolean().optional(),
  stock: z.enum(["in stock", "out of stock"]).default("in stock"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

function AddMenuItem() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSpecial: false,
      isMainMenu: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/foodItems/addFoodItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        console.error("Error Details:", errorData);
        return;
      }

      toast.success("Application Submitted.");
     } catch (error) {
      toast.error("Something went wrong. Please try again.");
     } finally {
      setIsSubmitting(false);
    }
  };


    // Fetch categories
    useEffect(() => {
      const fetchMedicines = async () => {
        const response = await fetch(`${BASE_URL}/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',  
          },
        });
        const data = await response.json();
        setCategories(data.data); 
      };
  
      fetchMedicines();
    }, []);

  return (
    <div className="container p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-32 items-center">
            <div className="flex flex-col gap-8">
              {/* Item Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Cheese Burger" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                    <Dropdown categories={categories} onSelect={(category)=>{field.onChange(category)}} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a description of the item..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="685.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* isSpecial Checkbox */}
              <FormField
                control={form.control}
                name="isSpecial"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel >Special Item</FormLabel>
                  </FormItem>
                )}
              />

              {/* isMainMenu Checkbox */}
              <FormField
                control={form.control}
                name="isMainMenu"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel>Main Menu Item</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div>
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <ImageUpload onUpload={(url) => field.onChange(url)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Adding Item..." : "Add Item"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AddMenuItem;
