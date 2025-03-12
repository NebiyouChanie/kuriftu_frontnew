import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import AlertDialog from "@/components/Alert";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";

export const CellAction = ({ data }) => {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Delete functionality
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}/reservations/${data._id}`);
      toast.success("Reservation Deleted.");
      setTimeout(() => {
        navigate(0);  
      }, 2500);
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Confirm functionality
  const onConfirm = async () => {
    try {
      const response = await axios.patch(`${BASE_URL}/reservations/confirm/${data._id}`);
      toast.success("Reservation Confirmed.");
      setTimeout(() => {
        navigate(0);  
      }, 2500);
    } catch (error) {
      toast.error("Something Went Wrong");
    }  
  };

  // Cancel functionality
  const onCancel = async () => {
    try {
      const response = await axios.patch(`${BASE_URL}/reservations/cancel/${data._id}`);
      toast.success("Reservation Canceled.");
      setTimeout(() => {
        navigate(0);  
      }, 2500);
    } catch (error) {
      toast.error("Something Went Wrong");
    } 
  };

  const Delete = async () => {
    setOpen(false); // Close the dialog
    await onDelete();
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to Remove this reservation?"
        confirmText="Yes, Remove"
        cancelText="Cancel"
        onConfirm={Delete}
      />
      
      {/* Dropdown Menu for Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          {/* View Reservation Detail */}
          {/* <DropdownMenuItem
            onClick={() => navigate(`${location.pathname}/${data._id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Reservation Detail
          </DropdownMenuItem> */}

          {/* Update Reservation */}
          <DropdownMenuItem
            onClick={() => navigate(`${location.pathname}/${data._id}/update`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          
          {/* Confirm Reservation */}
          <DropdownMenuItem
            onClick={() => onConfirm()}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmed
          </DropdownMenuItem>
          
          {/* cancel Reservation */}
          <DropdownMenuItem
            onClick={() => onCancel()}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </DropdownMenuItem>

          {/* Delete Reservation */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
