
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Building,
  Briefcase,
  ClipboardList,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useClients } from "@/hooks/use-clients";
import { ClientFormData, ClientStatus } from "@/services/client.service";

// Schema for client form
const clientFormSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  trading_name: z.string().optional(),
  abn: z.string().min(11, "ABN must be 11 digits").max(11).or(z.literal('')),
  acn: z.string().max(9).or(z.literal('')).optional(),
  industry: z.string().min(1, "Industry is required"),
  status: z.enum(['Active', 'Prospect', 'On Hold', 'Cancelled']).default('Prospect'),
});

// Define form values type to ensure it matches ClientFormData
type ClientFormValues = z.infer<typeof clientFormSchema>;

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get client data
  const { useClientDetails, updateClient, isUpdatingClient, updateClientError } = useClients();
  const { data: client, isLoading, error } = useClientDetails(id);

  // Initialize form with client data when available
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      business_name: "",
      trading_name: "",
      abn: "",
      acn: "",
      industry: "",
      status: "Prospect" as ClientStatus,
    },
  });
  
  // Update form values when client data is loaded
  useEffect(() => {
    if (client) {
      form.reset({
        business_name: client.business_name || "",
        trading_name: client.trading_name || "",
        abn: client.abn || "",
        acn: client.acn || "",
        industry: client.industry || "",
        status: (client.status as ClientStatus) || "Prospect",
      });
    }
  }, [client, form]);

  const onSubmit = async (values: ClientFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the data as needed
      const clientData: Partial<ClientFormData> = {
        business_name: values.business_name,
        trading_name: values.trading_name || null,
        abn: values.abn || null,
        acn: values.acn || null,
        industry: values.industry,
        status: values.status as ClientStatus,
      };
      
      // Call the update function
      await updateClient({ id, data: clientData });
      
      // Navigate back to client details
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error("Error updating client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-lg text-muted-foreground">Loading client data...</span>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "Failed to load client data"}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 max-w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/clients/${id}`}>{client.business_name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Client</h1>
        <Button variant="outline" asChild>
          <Link to={`/clients/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Client
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update the basic details about the client business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            <Building className="h-4 w-4" />
                          </span>
                          <Input className="pl-10" placeholder="Legal business name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trading_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trading Name (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                          </span>
                          <Input className="pl-10" placeholder="Trading as name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="abn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ABN</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            <ClipboardList className="h-4 w-4" />
                          </span>
                          <Input 
                            className="pl-10" 
                            placeholder="11 digit ABN" 
                            {...field} 
                            maxLength={11}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ACN (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            <ClipboardList className="h-4 w-4" />
                          </span>
                          <Input 
                            className="pl-10" 
                            placeholder="9 digit ACN" 
                            {...field}
                            maxLength={9}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Hospitality">Hospitality</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to={`/clients/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditClient;
