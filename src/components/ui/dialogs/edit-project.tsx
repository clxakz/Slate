import { Button } from "@/components/shadcn/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { ProjectType, useGlobal } from "@/components/global-provider";


export default function EditProjectDialog({project, open, onOpenChange}: {project: ProjectType, open: boolean, onOpenChange: (value: boolean) => void}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                </DialogHeader>

                <EditProjectForm setOpen={onOpenChange} project={project}/>
            </DialogContent>
        </Dialog>
    );
}



const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

function EditProjectForm({setOpen, project}: {setOpen: (state: boolean) => void, project: ProjectType}) {
    const { editProject } = useGlobal();

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
    })


    function onSubmit(values: z.infer < typeof formSchema > ) {
        try {
            editProject(project.id, values.name ?? project.name, values.description ?? project.description);
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
                    placeholder={project.name}
                    
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
                    placeholder={project.description}
                    className="resize-none max-h-[150px] custom-scrollbar"
                    {...field}
                    />
                </FormControl>
                <FormDescription>A brief description of your project</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Apply</Button>
        </form>
        </Form>
    );
}