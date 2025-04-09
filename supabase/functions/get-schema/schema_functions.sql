
-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS TABLE(table_name text)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT tablename as table_name
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
$$;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    column_name,
    data_type,
    is_nullable = 'YES' as is_nullable,
    column_default
  FROM 
    information_schema.columns
  WHERE 
    table_schema = 'public' 
    AND table_name = $1
  ORDER BY 
    ordinal_position;
$$;
