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

  // These fields are optional by default
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || emailRegex.test(value), // Validate email if provided
      {
        message: "Please enter a valid email address",
      }
    )
    .transform((value) => (value === "" ? null : value)),

  // Fields that become required only when orderType is Delivery
  phoneNumber: z.string().trim().optional()
  ,
    subcity: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || allowedSubcities.includes(value),
      {
        message: "Please select a valid subcity",
      }
    )
    .transform((value) => (value === "" ? null : value)),
  area: z.string().optional(),

  // Food items are always required
  foodItems: z.array(
    z.object({
      foodItem: z.string().trim().min(1, "Food name is required"),
      quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
      price: z.coerce.number().min(1, "Price must be greater than 0"),
    })
  ).min(1, "At least one food item is required"),
})
.superRefine((data, ctx) => {
  // For Delivery orders, these fields must be provided.
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
    } else {
      // Check if phone number matches the pattern
      const phoneRegex = /^(09[1-9]\d{7}|\+2519[1-9]\d{7})$/;
      if (!phoneRegex.test(data.phoneNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Ethiopian phone number. Use '09...' or '+2519' format.",
          path: ["phoneNumber"],
        });
      }
    }
  }
});

function AddOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Menus, setMenus] = useState([]);
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  // Initialize form with useForm
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
      foodItems: [{ foodItem: "", quantity: 1, price: 0 }],
    },
  });

  const { handleSubmit, control, watch, reset } = form;
  const [totalPrice, setTotalPrice] = useState(0);

  // Use field array for managing dynamic food items
  const { fields, append, remove } = useFieldArray({
    control,
    name: "foodItems",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Convert empty email to undefined (field will be omitted)
      if (!data.email || data.email.trim() === "") {
        delete data.email;
      }

      // Convert empty subcity to "N/A"
      if (!data.subcity || data.subcity.trim() === "") {
        data.subcity = "N/A";
      }

      // Format phone number
      if (data.phoneNumber.startsWith("09")) {
        data.phoneNumber = "+251" + data.phoneNumber.slice(1);
      }

      // Send data to the backend
      const response = await fetch(`${BASE_URL}/orders/`, {
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
      toast.success("Order Added Successfully.");
       
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch food items
  useEffect(() => {
    const fetchMenus = async () => {
      const response = await fetch(`${BASE_URL}/foodItems`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMenus(data.data);
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    const items = watch("foodItems");

    // Update prices for each food item
    items.forEach((item, index) => {
      const selectedFood = Menus.find((menu) => menu._id === item.foodItem);
      if (selectedFood) {
        form.setValue(`foodItems[${index}].price`, selectedFood.price);
      }
    });

    const newTotalPrice = items.reduce((acc, item) => {
      return acc + (item.price * item.quantity || 0);
    }, 0);

    setTotalPrice(newTotalPrice);
  }, [watch("foodItems"), selected, Menus]);

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

              {/* First Name */}
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

              {/* Food Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Food Items</h3>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <FormField
                      control={control}
                      name={`foodItems[${index}].foodItem`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food *</FormLabel>
                          <FormControl>
                            <Dropdown
                              Menus={Menus}
                              onSelect={(menu) => {
                                field.onChange(menu);
                                setSelected(!selected);
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`foodItems[${index}].quantity`}
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
                    <p className="text-sm font-semibold">Price: {Menus.find((menu) => menu._id === watch(`foodItems[${index}].foodItem`))?.price || 0} ETB</p>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <Button type="button" variant="secondary" size="sm" onClick={() => append({ foodItem: "", quantity: 1 })}>
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
            <Button onClick={() => reset()}>
              <Eraser />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddOrder;