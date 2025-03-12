import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_URL } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";  
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import AlertDialog from "@/components/Alert";
import { toast } from "react-toastify";
import  ImageModal  from "@/components/Modal";
import axios from "axios";
import { useNavigate} from "react-router-dom";

function MenuItemDetail() {
    const { menuId } = useParams();
    const [menuItem, setMenuItem] = useState(null); // State to store the menu item data
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await fetch(`${BASE_URL}/foodItems/${menuId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseJson = await response.json();
                setMenuItem(responseJson.data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };

        fetchMenuItem();
    }, [menuId]);  

      // Delete functionality
        const onDelete = async () => {
            try {
            const response = await axios.delete(`${BASE_URL}/foodItems/${menuId}`);
            toast.success("Menu Item Deleted.");
            setTimeout(() => {
                navigate(-1);  
            }, 1000);
            } catch (error) {
            toast.error("Something Went Wrong");
            } finally {
            setOpen(false);
            }
        };
        const Delete = async () => {
            setOpen(false); // Close the dialog
            await onDelete();
        };
    
        // Handle opening the modal with image URL and title
        const openModal = (imageUrl, title) => {
            setModalImage(imageUrl);
            setModalTitle(title);
            setIsModalOpen(true);
        };

        // Handle closing the modal
        const closeModal = () => {
            setIsModalOpen(false);
            setModalImage("");  
            setModalTitle("");  
        };

    // show a loading state 
    if (!menuItem) {
        return (
            <div className="flex gap-8 p-6">
                {/* Skeleton Loader for the Image */}
                <div className="rounded-lg">
                    <Skeleton className="w-full h-[184px] rounded-lg" />
                </div>
                <div className="max-w-96">
                    <div className="mb-3">
                        <Skeleton className="w-1/2 h-6 mb-2" />
                        <Skeleton className="w-1/4 h-4 mb-3" />
                        <div className="flex gap-2">
                            <Skeleton className="w-10 h-5" />
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton key={index} className="w-4 h-4 rounded-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-6 mb-4" />
                    <Skeleton className="w-20 h-6 rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-8 p-8">
            {/* Delete Confirmation Dialog */}
                  <AlertDialog
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title="Confirm Deletion"
                    message="Are you sure you want to Remove this Order?"
                    confirmText="Yes, Remove"
                    cancelText="Cancel"
                    onConfirm={Delete}
                  />

                <ImageModal
                imageSrc={modalImage}  
                isOpen={isModalOpen}  
                onClose={closeModal}  
                title={modalTitle}    
                />
            <div className="w-96 h-96 rounded-lg">
                <img
                    src={menuItem?.imageUrl}
                    alt={menuItem?.name}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={() => openModal(menuItem?.imageUrl, `${menuItem?.name}`)}
                />
            </div>
            <div className="max-w-96">
                <div className="mb-3">
                    <h3 className="font-semibold text-base">{menuItem?.name}</h3>
                    <p className="text-[14px] text-textgray"># {menuItem?.category?.name}</p>
                     
                </div>
                <p className="text-textgray mb-2">
                    {menuItem?.description || 'No description available.'}
                </p>
                <p className="font-semibold mb-4 text-[14px]">
                    ETB {menuItem?.price.toFixed(2)}
                </p>

                <div
                    className={`py-[1px] px-3 rounded-md w-fit h-fit mb-16 ${
                        !menuItem?.isInStock ? 'text-red-700 bg-red-200' : 'text-green-700 bg-green-200'
                    }`}
                >
                    {menuItem?.isInStock ? 'In stock' : 'Out of stock'}
                </div>

                <div className='flex gap-4'>
                    <Link to={`/menu/${menuItem?._id}/update`}>
                        <Button variant="secondary" className="text-primary">
                            <Edit /> Update Item
                        </Button>
                    </Link>
                    <Button onClick={() => setOpen(true)}>
                        <Trash /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default MenuItemDetail;
