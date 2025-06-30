import { Button } from "@/components/shadcn/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { LanguageOptions, ProjectType, useGlobal } from "@/components/global-provider";
import MultipleSelector from "@/components/shadcn/multiselect";


export default function EditProjectDialog({project, open, onOpenChange}: {project: ProjectType, open: boolean, onOpenChange: (value: boolean) => void}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>

                <EditProjectForm setOpen={onOpenChange} project={project}/>
            </DialogContent>
        </Dialog>
    );
}


const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  languages: z.array(optionSchema).optional(),
});

function EditProjectForm({setOpen, project}: {setOpen: (state: boolean) => void, project: ProjectType}) {
    const { editProject } = useGlobal();

    const defaultSelectedOptions = Array.isArray(project.languages) ? LanguageOptions.filter(option => project.languages.includes(option.value)): [];

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
    })


    function onSubmit(values: z.infer < typeof formSchema > ) {
        try {
            const valuesOnly = values.languages?.map(lang => lang.value);
            editProject(project.id, values.name ?? project.name, values.description ?? project.description, valuesOnly ?? project.languages);
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

            <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Languages</FormLabel>
                <FormControl>
                    <MultipleSelector
                    hidePlaceholderWhenSelected
                    {...field}
                    defaultOptions={LanguageOptions}
                    value={defaultSelectedOptions}
                    placeholder="Select languages this project will use..."
                    emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                        </p>
                    }
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit">Apply</Button>
        </form>
        </Form>
    );
}