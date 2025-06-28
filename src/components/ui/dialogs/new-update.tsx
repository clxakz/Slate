import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shadcn/alert-dialog";
import { toast } from "sonner";

export default function NewUpdateDialog({open, onOpenChange, version}: {open: boolean, onOpenChange: (value: boolean) => void, version: string}) {
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
                    Version {version}
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