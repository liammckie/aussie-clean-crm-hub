# Form Validation System Documentation

## Overview

This document describes our form validation approach, which combines TypeScript static typing with Zod schema validation to ensure data integrity throughout the application. The system provides both client-side and server-side validation with consistent error handling.

## Architecture

Our form validation architecture consists of:

1. **Type Definitions**: TypeScript interfaces that define the shape of form data
2. **Zod Schemas**: Runtime validation schemas that correspond to TypeScript types
3. **Validation Utilities**: Helper functions for validating data on client and server
4. **Form Components**: Reusable components that integrate with the validation system
5. **Default Value Helpers**: Functions to create properly typed default values

## Core Components

### 1. Type Definitions

Form types are centralized in `src/types/form-types.ts`. We define base schemas for common entities and extend them for specific use cases.

```typescript
// Base address schema
import { z } from 'zod';

export const addressBaseSchema = z.object({
  address_line_1: z.string().min(1, { message: 'Street address is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(4, { message: 'Postcode must be at least 4 characters' }),
  country: z.string().default('Australia'),
  address_type: z.enum(['billing', 'postal', 'physical']).default('billing'),
  is_primary: z.boolean().default(false),
});

// Type inference from schema
export type AddressBaseFormData = z.infer<typeof addressBaseSchema>;
```

### 2. Validation Utilities

#### Client-Side Validation

The `validateFormData` function in `src/utils/form-validation.ts` validates data against Zod schemas:

```typescript
import { ZodSchema, ZodError } from 'zod';
import { toast } from 'sonner';

/**
 * Interface for validation errors
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Validates data against a given schema
 */
export function validateFormData<T>(
  schema: ZodSchema, 
  data: unknown
): ValidationResult<T> {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData as T
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });

      return {
        success: false,
        errors: fieldErrors,
        message: "Validation failed. Please check the form for errors."
      };
    }
    
    return {
      success: false,
      message: "An unexpected error occurred during validation."
    };
  }
}
```

#### Server-Side Validation

The `validateServerData` function in `src/services/validation/form-validation.ts` provides server-side validation:

```typescript
import { z, ZodSchema } from 'zod';
import { ValidationErrorResponse } from '@/services/unified/types';

/**
 * Server-side validation utility for validating form data
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or validation error
 */
export function validateServerData<T>(
  schema: ZodSchema, 
  data: unknown
): { data: T } | ValidationErrorResponse {
  try {
    const validData = schema.parse(data);
    return { data: validData as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        category: 'validation',
        message: firstError.message,
        details: {
          field: firstError.path.join('.'),
          code: 'invalid_input'
        }
      };
    }
    
    return {
      category: 'validation',
      message: 'Invalid form data provided'
    };
  }
}
```

### 3. Default Value Helpers

Helper functions create properly typed default values with all required fields:

```typescript
import { UnifiedAddressFormData } from '@/types/form-types';

export const createDefaultAddressValues = (
  initialData: Partial<UnifiedAddressFormData> = {}
): UnifiedAddressFormData => ({
  address_line_1: initialData.address_line_1 || '',
  address_line_2: initialData.address_line_2 || '',
  suburb: initialData.suburb || '',
  state: initialData.state || '',
  postcode: initialData.postcode || '',
  country: initialData.country || 'Australia',
  address_type: initialData.address_type || 'billing',
  is_primary: initialData.is_primary || false,
  entity_type: initialData.entity_type,
  entity_id: initialData.entity_id,
  name: initialData.name || '',
});
```

## How to Use the Validation System

### Creating a New Form

#### Step 1: Define Zod Schema and TypeScript Type

```typescript
// In your domain-specific types file
import { z } from 'zod';

export const myFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  age: z.number().min(18, { message: 'Must be at least 18 years old' }).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { 
    message: 'You must agree to the terms' 
  })
});

export type MyFormData = z.infer<typeof myFormSchema>;
```

#### Step 2: Create Default Values Helper

```typescript
export const createDefaultMyFormValues = (
  initialData: Partial<MyFormData> = {}
): MyFormData => ({
  name: initialData.name || '',
  email: initialData.email || '',
  age: initialData.age,
  agreeToTerms: initialData.agreeToTerms || false
});
```

#### Step 3: Implement the Form Component

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { myFormSchema, MyFormData, createDefaultMyFormValues } from './types';

interface MyFormProps {
  onSubmit: (data: MyFormData) => void;
  initialData?: Partial<MyFormData>;
  isLoading?: boolean;
}

export function MyForm({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false 
}: MyFormProps) {
  const form = useForm<MyFormData>({
    resolver: zodResolver(myFormSchema),
    defaultValues: createDefaultMyFormValues(initialData)
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

#### Step 4: Handle Form Submission with Validation

```typescript
import { validateFormData, handleValidationErrors, applyValidationErrorsToForm } from '@/utils/form-validation';
import { toast } from 'sonner';

const handleSubmit = async (formData: MyFormData) => {
  // Client-side validation
  const validationResult = validateFormData<MyFormData>(myFormSchema, formData);
  
  if (!validationResult.success) {
    // Apply validation errors to form
    if (validationResult.errors) {
      applyValidationErrorsToForm(form, validationResult.errors);
    }
    toast.error(validationResult.message || 'Validation failed');
    return;
  }
  
  try {
    // Submit to API
    const response = await apiService.submitData(validationResult.data);
    
    // Check for server validation errors
    if (response && 'category' in response && response.category === 'validation') {
      handleValidationErrors(form, response);
      return;
    }
    
    // Success handling
    toast.success('Form submitted successfully!');
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

### Server-Side Implementation

#### Step 1: Create Validation in Your API Handler

```typescript
import { validateServerData } from '@/services/validation';

export async function handleFormSubmission(req: Request) {
  // Parse request body
  const rawData = await req.json();
  
  // Validate with schema
  const validationResult = validateServerData<MyFormData>(myFormSchema, rawData);
  
  // Return validation errors if any
  if ('category' in validationResult) {
    return Response.json(validationResult, { status: 400 });
  }
  
  // Process valid data
  const data = validationResult.data;
  
  // ... your business logic ...
  
  return Response.json({ success: true });
}
```

## Field Validation Examples

### Text Field with Validation

```typescript
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Number Field with Validation

```typescript
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

<FormField
  control={form.control}
  name="age"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Age</FormLabel>
      <FormControl>
        <Input 
          type="number"
          placeholder="Enter age"
          {...field}
          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox Field with Boolean Validation

```typescript
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

<FormField
  control={form.control}
  name="agreeToTerms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox 
          checked={field.value} 
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>I agree to the terms and conditions</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Common Validation Patterns

### Required Fields

```typescript
z.string().min(1, { message: 'This field is required' })
```

### Email Validation

```typescript
z.string().email({ message: 'Please enter a valid email address' })
```

### Numeric Range

```typescript
z.number()
  .min(0, { message: 'Must be a positive number' })
  .max(100, { message: 'Cannot exceed 100' })
```

### Conditional Validation

```typescript
z.object({
  hasDiscount: z.boolean(),
  discountCode: z.string().optional()
    .refine(
      (code, ctx) => !ctx.data.hasDiscount || (code && code.length > 0), 
      { message: 'Discount code is required when discount is selected' }
    )
})
```

### Custom Business ID Validation

```typescript
import { validationService } from '@/services/validation.service';

z.string().refine(
  (abn) => validationService.isValidABN(abn),
  { message: 'Please enter a valid ABN' }
)
```

## Best Practices

1. **Centralize Schemas**: Keep related schemas in domain-specific files
2. **Consistent Error Messages**: Use clear, user-friendly error messages
3. **Default Values**: Always provide sensible defaults for form fields
4. **Type Safety**: Leverage TypeScript to catch type errors at build time
5. **Reusable Components**: Create field components for common validation patterns
6. **Server Validation**: Always validate on the server even with client validation
7. **Error Handling**: Provide clear feedback for validation errors

## Troubleshooting

### Common Issues

#### Type Errors with Optional Fields

If you encounter TypeScript errors with optional fields, ensure your default value helper correctly handles optional fields:

```typescript
// Correct approach for optional number field
age: initialData.age !== undefined ? initialData.age : undefined,
```

#### Zod Schema Not Matching TypeScript Type

Ensure your Zod schema aligns with your TypeScript interface. Use `z.infer<typeof yourSchema>` to derive types directly from schemas.

#### Form Not Showing Validation Errors

Ensure you're using the `FormMessage` component from our UI library to display errors and that field names in the form match those in the schema.

## Getting Help

For additional assistance:
- Check the error logs for validation errors
- Review the TypeScript type definitions
- Consult the ERROR_HANDLING.md document for application-wide error handling strategies
