
# Supabase Error Codes

This document tracks common error codes encountered in the application that originate from Supabase/PostgreSQL and their solutions.

## PostgreSQL Error Codes

| Code    | Error Type                | Description                                  | Resolution |
|---------|---------------------------|----------------------------------------------|------------|
| 23505   | Unique Violation          | Duplicate key violates unique constraint     | Ensure you're not trying to insert duplicate records. Check for existing records before insertion. |
| 42P01   | Undefined Table           | The specified table does not exist           | Verify table name is correct and the table exists in the schema. |
| 42501   | Insufficient Privilege    | Permission denied for operation              | Check RLS policies and ensure user has appropriate permissions. |
| 23502   | Not Null Violation        | NULL value violates not-null constraint      | Ensure required fields have values before submission. |
| 22P02   | Invalid Text Representation | Invalid input syntax                       | Validate input format before sending to database. |

## Row Level Security (RLS) Errors

| Error Message                         | Description                                | Resolution |
|---------------------------------------|--------------------------------------------|------------|
| new row violates row-level security policy | RLS policy prevents the operation     | Ensure the user has proper permissions and that RLS policies are correctly configured. |
| permission denied for table           | User lacks permission for the table        | Check if the user is authenticated and has the required role for the operation. |

## Authentication Errors

| Error Type          | Description                                | Resolution |
|---------------------|--------------------------------------------|------------|
| Invalid JWT         | Token is expired or malformed              | Re-authenticate the user or refresh the token. |
| Invalid login credentials | Incorrect email/password             | Verify credentials or implement password recovery. |
| Email not confirmed | User needs to confirm email                | Prompt user to check their email for confirmation link. |

## Network Errors

| Error Type          | Description                                | Resolution |
|---------------------|--------------------------------------------|------------|
| Connection error    | Failed to connect to Supabase              | Check internet connection and Supabase service status. |
| Timeout             | Request took too long                      | Optimize request or increase timeout. |

## Best Practices

1. **Use try/catch blocks**: Always wrap Supabase operations in try/catch blocks to properly handle errors.
2. **Provide user-friendly messages**: Translate technical errors into user-friendly messages.
3. **Log detailed errors**: Log the full error details for debugging while showing simplified messages to users.
4. **Check for network issues**: Handle network connectivity issues gracefully.
5. **Implement retry logic**: For transient errors, implement retry logic with exponential backoff.

## Example Error Handling

```typescript
try {
  const { data, error } = await supabase.from('clients').insert(newClient);
  
  if (error) throw error;
  
  return { success: true, data };
} catch (error) {
  if (isSupabaseError(error)) {
    // Handle known Supabase errors
    const errorResponse = handleSupabaseError(
      error, 
      'Failed to create client',
      { operation: 'createClient' }
    );
    return errorResponse;
  }
  
  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return { 
    message: 'An unexpected error occurred', 
    category: 'unknown' 
  };
}
```
