
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { validateFormData, applyValidationErrorsToForm } from '@/utils/form-validation';
import { createSchemaValidator } from '@/services/validation/validation-utils';

// Step 1: Define the schema
const exampleFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  age: z.number({ invalid_type_error: 'Age must be a number' })
    .min(18, { message: 'You must be at least 18 years old' })
    .optional(),
  acceptTerms: z.boolean().refine(val => val === true, { 
    message: 'You must accept the terms and conditions'
  })
});

// Step 2: Derive TypeScript type from schema
type ExampleFormData = z.infer<typeof exampleFormSchema>;

// Step 3: Create default values helper
const createDefaultExampleValues = (
  initialData: Partial<ExampleFormData> = {}
): ExampleFormData => ({
  name: initialData.name || '',
  email: initialData.email || '',
  age: initialData.age,
  acceptTerms: initialData.acceptTerms || false
});

// Create server validator (would be used in API handlers)
const validateExampleForm = createSchemaValidator<ExampleFormData>(exampleFormSchema);

// Example form component
export function ExampleValidatedForm() {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: createDefaultExampleValues()
  });

  const onSubmit = async (data: ExampleFormData) => {
    // Demonstration of client-side validation
    const validationResult = validateFormData<ExampleFormData>(exampleFormSchema, data);
    
    if (!validationResult.success) {
      // Apply validation errors to form fields
      if (validationResult.errors) {
        applyValidationErrorsToForm(form, validationResult.errors);
      }
      toast.error(validationResult.message || 'Validation failed');
      return;
    }

    // Simulate API call with server-side validation
    setTimeout(() => {
      // Simulate successful submission
      toast.success('Form submitted successfully!');
      console.log('Form data:', validationResult.data);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Example Validated Form</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormDescription>Your full name as it appears on official documents</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Enter your age"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>You must be at least 18 years old</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Accept terms and conditions</FormLabel>
                  <FormDescription>
                    You must agree to our terms of service and privacy policy.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit Form</Button>
        </form>
      </Form>
    </div>
  );
}
