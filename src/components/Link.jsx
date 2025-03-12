import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "./ui/button";
import {toast} from 'react-toastify'

 


export const ReferalLink = ({
    title,
    description,
}) => {

    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Pharmacist Registering Link copied to the clip board")
    }

    return (
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size='icon' onClick={onCopy}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
       </Alert>
    )
}