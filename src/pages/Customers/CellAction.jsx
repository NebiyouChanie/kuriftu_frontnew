import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import AlertDialog from "@/components/Alert";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import  {useNavigate,useLocation} from 'react-router-dom';
import { Eye } from "lucide-react";

 
export const CellAction = ({
    data
}) => {
    
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();

  
    
    const onDelete = async() => {
        try {
            setLoading(true)
            const response = await axios.delete(`${BASE_URL}/users/${data._id}`)
            toast.success("Medicine Removed from platform successfully.")
            
            setTimeout(() => {
                navigate(0); // Triggering page reload
            }, 2500);
         
        } catch (error) {
            toast.error("Something Went Wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    
    const Delete = async () => {
        setOpen(false); // Close the dialog
        await onDelete();
      };

    return (
        <>

        <AlertDialog
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Confirm Deletion"
            message="Are you sure you want to Remove this medicine from the platform?"
            confirmText="Yes, Remove"
            cancelText="Cancel"
            onConfirm={Delete}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>navigate(`${location.pathname}/${data._id}/detail`)}>
                    <Eye className="mr-2 h-4 w-4"/> 
                    View Customer Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`${location.pathname}/${data._id}/update`) }>
                    <Edit className="mr-2 h-4 w-4"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}