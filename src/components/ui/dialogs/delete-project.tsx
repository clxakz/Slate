import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shadcn/alert-dialog";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useState } from "react";


export default function DeleteProjectDialog({onDelete, open, onOpenChange}: {onDelete: (delete_files: boolean) => void, open: boolean, onOpenChange: (value: boolean) => void}) {
    const [checked, setChecked] = useState<boolean>(false);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex gap-1">
                    <Checkbox id="delete-files" checked={checked} onCheckedChange={(value) => {if (value !== "indeterminate") {setChecked(value)}}}/>
                    <Label htmlFor="delete-files">Delete project files</Label>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(checked)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}