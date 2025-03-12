import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BASE_URL } from "@/lib/utils";
import {toast} from "react-toastify";
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
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

 

function UpdateReservation() {
  
    // Initialize form with useForm
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
  const navigate = useNavigate();
  const  {reservationId} = useParams();
  const { handleSubmit, control, reset } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
   const onSubmit = async (data) => {
       try {
        setIsSubmitting(true)
        const response = await fetch(`${BASE_URL}/reservations/${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',  
          },
          body: JSON.stringify(data),  
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message || "Request failed"}`);
          console.error("Error Details:", errorData);
          return;
        }
    
        toast.success("Reservation Updated Successfully.");
        navigate(-1)
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error Details:", error);
      }finally{
        setIsSubmitting(false)
      }
    };
    
    useEffect(()=>{
      const fetchReservation = async ()=>{
         try {
            const response = await fetch(`${BASE_URL}/reservations/${reservationId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const responseJson = await response.json();
            const reservation = responseJson.data
            // console.log(reservation?.customer?.firstName)             
            if (reservation) {
              reset({
                firstName: reservation?.customer?.firstName || "",
                lastName: reservation?.customer?.lastName || "",   
                phoneNumber: reservation?.customer?.phoneNumber || "",
                numberOfGuests: reservation?.numberOfGuests || 1,  
                date: reservation?.date?.split("T")[0] || "",  
                time: reservation?.time || "", 
                message: reservation?.message || "",
              });
            }
          } catch (error) {
            console.error("Error fetching inventory:", error);
          }
      }
      
      fetchReservation()
    },[])

  return (
    <div className="p-6">
       <Form {...form}>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                 <div className="max-w-96 items-center">
                   <div className="flex flex-col gap-8">
                     <div className="grid grid-cols-2">

                     {/* First Name */}
                     <FormField
                       control={control}
                       name="firstName"
                       render={({ field }) => (
                         <FormItem >
                           <FormLabel className="font-bold">First Name </FormLabel>
                           <FormControl>
                             <Input className="border-none" readOnly placeholder="John" {...field} />
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
                             <Input className="border-none" readOnly placeholder="Doe" {...field} />
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
                           <FormLabel>Phone Number </FormLabel>
                           <FormControl>
                             <Input className="border-none" readOnly type="tel" placeholder="0912 345 678" {...field} />
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
                             <Input autoFocus type="number" {...field} />
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
                   {isSubmitting ? "Submitting..." : "Update Reservation"}
                 </Button>
               </form>
             </Form>

    </div>
  );
}

export default UpdateReservation;

 