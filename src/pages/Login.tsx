
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/App";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info, Shield, Sparkles, Users } from "lucide-react";

// Create a schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // This is a mock authentication - in a real application, this would call an API
      // For demo purposes, we'll simulate a successful login after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      
      // Call the login function from auth context
      login();
      
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // Show error message if login fails
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFAQ = (id: string) => {
    if (expandedFAQ === id) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(id);
    }
  };

  const faqs = [
    {
      id: 'faq1',
      question: 'What is Aussie Clean ERP?',
      answer: 'Aussie Clean ERP is a comprehensive enterprise resource planning system designed specifically for cleaning businesses to manage operations, scheduling, inventory, and client relationships.',
      icon: <Info className="w-5 h-5" />
    },
    {
      id: 'faq2',
      question: 'How secure is my data?',
      answer: 'We implement industry-leading security measures including end-to-end encryption, regular security audits, and multi-factor authentication to ensure your data remains protected.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'faq3',
      question: 'Can I manage my team through this platform?',
      answer: 'Yes, our ERP system includes robust team management features including scheduling, performance tracking, and automated task assignment to optimize your workforce.',
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col md:flex-row items-stretch">
        {/* Left side: Animated visual */}
        <div className="w-full md:w-1/2 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-indigo-950 to-slate-950"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-500/5 blur-3xl"></div>
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl"></div>
          </div>
          
          {/* Central content */}
          <div className="relative z-10 max-w-xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-br from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
                Aussie Clean ERP
              </h1>
              <p className="text-purple-300/80 text-lg md:text-xl font-light max-w-md mx-auto">
                Streamlining operations for cleaning businesses across Australia
              </p>
            </div>
            
            <div className="grid gap-8 mt-12">
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <Collapsible 
                    key={faq.id} 
                    open={expandedFAQ === faq.id}
                    className="border border-purple-800/30 rounded-lg bg-slate-900/50 backdrop-blur-sm overflow-hidden"
                  >
                    <CollapsibleTrigger 
                      onClick={() => toggleFAQ(faq.id)}
                      className="flex items-center justify-between w-full p-4 text-left hover:bg-purple-900/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-900/30">
                          {faq.icon}
                        </div>
                        <h3 className="text-white font-medium">{faq.question}</h3>
                      </div>
                      {expandedFAQ === faq.id ? 
                        <ChevronUp className="h-5 w-5 text-purple-400" /> : 
                        <ChevronDown className="h-5 w-5 text-purple-400" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-1 text-purple-200/70 text-sm">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              
              <div className="flex items-center mt-8 justify-center">
                <div className="relative flex h-7 items-center px-2">
                  <div className="h-0.5 w-16 bg-purple-800/30"></div>
                </div>
                <span className="text-purple-300 text-xs font-medium px-4 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Workflow
                </span>
                <div className="relative flex h-7 items-center px-2">
                  <div className="h-0.5 w-16 bg-purple-800/30"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom decorative element */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        </div>
        
        {/* Right side: Form */}
        <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950"></div>
          
          <Card className="w-full max-w-md border-purple-900/20 bg-slate-900/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(91,33,182,0.1)] relative z-10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Sign In</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to access the ERP system
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-slate-800/50 border-slate-700 focus:border-purple-500 transition-colors" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-slate-800/50 border-slate-700 focus:border-purple-500 transition-colors" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button variant="link" className="p-0 h-auto text-xs text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-xs text-center text-slate-500 mt-4">
                    <p>
                      Secure Enterprise Resource Planning System
                    </p>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}
