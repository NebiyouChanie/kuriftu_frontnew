import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, Trash, PlusCircle, Eraser } from "lucide-react";
import Dropdown from "../components/DropdownMenu";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(09[1-9]\d{7}|\+2519[1-9]\d{7})$/;

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

const formSchema = z.object({
  orderType: z.enum(["DineIn", "Delivery"], { required_error: "Order Type is required" }),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || emailRegex.test(value), {
      message: "Please enter a valid email address",
    })
    .transform((value) => (value === "" ? null : value)),
  phoneNumber: z.string().trim().optional(),
  subcity: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || allowedSubcities.includes(value), {
      message: "Please select a valid subcity",
    })
    .transform((value) => (value === "" ? null : value)),
  area: z.string().optional(),
  items: z.array(
    z.object({
      foodItemId: z.string().min(1, "Food item is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      removedIngredients: z.array(z.string()).optional(),
      specialInstructions: z.string().optional(),
    })
  ).min(1, "At least one food item is required"),
}).superRefine((data, ctx) => {
  if (data.orderType === "Delivery") {
    if (!data.firstName || data.firstName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "First Name is required for Delivery",
        path: ["firstName"],
      });
    }
    
    if (!data.subcity || data.subcity.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SubCity is required for Delivery",
        path: ["subcity"],
      });
    }
    
    if (!data.area || data.area.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Area is required for Delivery",
        path: ["area"],
      });
    }
    
    if (!data.phoneNumber || data.phoneNumber.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone Number is required for Delivery",
        path: ["phoneNumber"],
      });
    } else if (!phoneRegex.test(data.phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Ethiopian phone number. Use '09...' or '+2519' format.",
        path: ["phoneNumber"],
      });
    }
  }
});

function AddOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      subcity: "",
      orderType: "",
      area: "",
      items: [{ foodItemId: "", quantity: 1 }],
    },
  });

  const { handleSubmit, control, watch, reset } = form;
  const [totalPrice, setTotalPrice] = useState(0);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Format phone number if it starts with 09
      if (data.phoneNumber?.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }

      // Prepare the request body according to your backend expectations
      const requestBody = {
        userId: "67fa50d832141b24c3c5eb44", // You should replace this with actual user ID
        items: data.items.map(item => ({
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          removedIngredients: item.removedIngredients || [],
          specialInstructions: item.specialInstructions || ""
        })),
        ...(data.orderType === "Delivery" && {
          deliveryDetails: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            subcity: data.subcity,
            area: data.area
          }
        })
      };

      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        return;
      }

      const responseData = await response.json();
      toast.success("Order created successfully!");
      navigate("/orders");
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/foodItems`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setFoodItems(data.data || []);
      } catch (error) {
        console.error("Error fetching food items:", error);
        toast.error("Failed to load food items");
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith("items") || name === "orderType") {
        const items = value.items || [];
        let newTotalPrice = 0;
        
        items.forEach(item => {
          const selectedFood = foodItems.find(food => food._id === item.foodItemId);
          if (selectedFood) {
            newTotalPrice += selectedFood.price * (item.quantity || 0);
          }
        });
        
        setTotalPrice(newTotalPrice);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, foodItems]);

  return (
    <div className="container p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="max-w-[450px] items-center">
            <div className="flex flex-col gap-8">
              {/* Order Type */}
              <FormField
                control={control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type *</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-48 text-sm p-2 border rounded-md flex items-center justify-between">
                            {field.value || "Select Order Type"}
                            <ArrowDown size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Select an Order Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {["DineIn", "Delivery"].map((type) => (
                            <DropdownMenuItem key={type} onClick={() => field.onChange(type)}>
                              {type}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Only show these fields for Delivery orders */}
              {watch("orderType") === "Delivery" && (
                <>
                  <div className="grid grid-cols-2 gap-8">
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

                  <div className="grid grid-cols-2 gap-8">
                    <FormField
                      control={control}
                      name="subcity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcity *</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="w-full text-sm p-2 border rounded-md flex items-center justify-between">
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
                </>
              )}

              {/* Food Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Food Items</h3>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <FormField
                      control={control}
                      name={`items[${index}].foodItemId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food *</FormLabel>
                          <FormControl>
                            <Dropdown
                              Menus={foodItems}
                              onSelect={(menuId) => {
                                field.onChange(menuId);
                                setSelected(!selected);
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`items[${index}].quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-sm font-semibold">
                      Price: {foodItems.find(food => food._id === watch(`items[${index}].foodItemId`))?.price || 0} ETB
                    </p>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <Button type="button" variant="secondary" size="sm" onClick={() => append({ foodItemId: "", quantity: 1 })}>
                    <PlusCircle /> Add Item
                  </Button>
                  <p className="text-lg font-semibold">Total: {totalPrice} ETB</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? "Submitting..." : "Add Order"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              <Eraser /> Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddOrder;
