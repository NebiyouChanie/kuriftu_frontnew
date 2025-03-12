import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Key } from "lucide-react";

export default function UserProfile() {
  const handleSignOut = () => {
    console.log("Signing out...");
    // Add sign-out logic here
  };

  const handleChangePassword = () => {
    console.log("Changing password...");
    // Add change password logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuItem onClick={handleChangePassword}>
          <Key className="w-4 h-4 mr-2" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
