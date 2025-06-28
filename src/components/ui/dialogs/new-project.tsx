import { Button } from "@/components/shadcn/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { useGlobal } from "@/components/global-provider";


export default function NewProjectDialog({children}: {children: ReactNode}) {
    const [open, setOpen] = useState<boolean>(false);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                </DialogHeader>

                <NewProjectForm setOpen={setOpen}/>
            </DialogContent>
        </Dialog>
    );
}



const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

function NewProjectForm({setOpen}: {setOpen: (state: boolean) => void}) {
    const { addProject } = useGlobal();

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
    })


    function onSubmit(values: z.infer < typeof formSchema > ) {
        try {
            addProject(values.name, values.description ?? "No description");
            setOpen(false);
        } catch (error) {
            console.error("Form submission error", error);
        }
    }


    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input 
                    placeholder=""
                    
                    type=""
                    {...field} />
                </FormControl>
                
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder=""
                    className="resize-none max-h-[150px] custom-scrollbar"
                    {...field}
                    />
                </FormControl>
                <FormDescription>A brief description of your project</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Create</Button>
        </form>
        </Form>
    );
}