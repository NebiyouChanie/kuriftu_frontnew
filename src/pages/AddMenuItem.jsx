import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";  
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from "@/components/ImageUpload";
import Dropdown from "../components/Dropdown"; 
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";

// Updated validation schema to match foodItem model
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be a positive number")),
  preparationTime: z.preprocess((val) => Number(val), z.number().min(0, "Preparation time must be a positive number")),
  ingredients: z.preprocess(
    (val) => {
      // Handle both string input and array input
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map(item => item.trim()).filter(item => item);
      return [];
    },
    z.array(z.string()).min(1, "At least one ingredient is required")
  ),  category: z.string().trim().min(1, "Category is required"),
  isInStock: z.boolean().default(true),
  dietaryTags: z.array(z.string()).optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

function AddMenuItem() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free',
    'halal', 'kosher', 'dairy-free',
    'nut-free', 'organic'
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: [],
      isInStock: true,
      dietaryTags: [],
      images: [],
    },
  });

  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data.images)
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

      toast.success("Food item added successfully!");
     } catch (error) {
      toast.error("Something went wrong. Please try again.");
     } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',  
        },
      });
      const data = await response.json();
      setCategories(data.data); 
    };
    fetchCategories();
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
                      <Dropdown categories={categories} onSelect={(category) => {field.onChange(category)}} {...field} />
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

              {/* Preparation Time */}
              <FormField
                control={form.control}
                name="preparationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Time (minutes) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredients */}
              <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients (comma separated) *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter ingredients separated by commas (e.g., flour, sugar, eggs)"
                          onChange={(e) => {
                            // This will trigger the Zod preprocessing
                            field.onChange(e.target.value);
                          }}
                          value={
                            Array.isArray(field.value) 
                              ? field.value.join(', ') 
                              : typeof field.value === 'string' 
                                ? field.value 
                                : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              {/* Stock Status */}
              <FormField
                control={form.control}
                name="isInStock"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel>In Stock</FormLabel>
                  </FormItem>
                )}
              />


              {/* Dietary Tags */}
              <FormField
                control={form.control}
                name="dietaryTags"
                render={() => (
                  <FormItem>
                    <FormLabel>Dietary Tags</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {dietaryOptions.map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="dietaryTags"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== option)
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {option}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
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
