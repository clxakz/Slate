import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shadcn/alert-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewUpdateDialog({open, onOpenChange, version}: {open: boolean, onOpenChange: (value: boolean) => void, version: string}) {
    const [currVersion, setCurrVersion] = useState<number>();
       
    useEffect(() => {
        const getVersion = async () => {
            const result = await window.api.send("get-app-version", {});
            setCurrVersion(result);
        }
    
        getVersion();
    }, []);
    
    const handleUpdate = async () => {
        const result = await window.api.send("install-update", {});
        if (result.success === true) { toast.info("Installing update..."); }
        else { toast.error(result.error); };
    }
    
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>New update is available</AlertDialogTitle>
                <AlertDialogDescription>
                    {currVersion}{" > "}{version}
                </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter>
                <AlertDialogCancel>Not now</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdate}>Update now</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
    );
}