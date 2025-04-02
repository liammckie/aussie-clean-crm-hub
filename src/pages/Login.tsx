
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
        {/* Left side: Brand and FAQs with enhanced lighting effects */}
        <div className="w-full md:w-1/2 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Enhanced lighting effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-purple-800/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[80px]"></div>
            
            {/* Light beams */}
            <div className="absolute top-0 left-1/4 w-1 h-[300px] bg-gradient-to-b from-purple-500/30 to-transparent rotate-[20deg] blur-[3px]"></div>
            <div className="absolute bottom-0 right-1/3 w-1 h-[200px] bg-gradient-to-t from-indigo-500/20 to-transparent -rotate-[15deg] blur-[3px]"></div>
          </div>
          
          {/* Dot grid overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-xl">
            <div className="mb-12 text-center">
              {/* Animated gradient text */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 relative">
                <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-200 bg-clip-text text-transparent drop-shadow-sm animate-gradient-shift">
                  Aussie Clean ERP
                </span>
                <div className="absolute -inset-1 rounded-lg blur-sm bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-70"></div>
              </h1>
              <p className="text-purple-300/90 text-lg md:text-xl font-light max-w-md mx-auto relative z-10">
                Streamlining operations for cleaning businesses across Australia
              </p>
            </div>
            
            {/* Enhanced FAQ section with glass effect */}
            <div className="grid gap-5 mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/0 via-purple-900/5 to-purple-900/0 rounded-xl"></div>
              <div className="space-y-4 relative">
                {faqs.map((faq) => (
                  <Collapsible 
                    key={faq.id} 
                    open={expandedFAQ === faq.id}
                    className="backdrop-blur-lg bg-white/[0.02] border border-white/10 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-200 hover:bg-white/[0.03]"
                  >
                    <CollapsibleTrigger 
                      onClick={() => toggleFAQ(faq.id)}
                      className="flex items-center justify-between w-full p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-md">
                          {faq.icon}
                        </div>
                        <h3 className="text-white font-medium">{faq.question}</h3>
                      </div>
                      {expandedFAQ === faq.id ? 
                        <ChevronUp className="h-5 w-5 text-purple-400" /> : 
                        <ChevronDown className="h-5 w-5 text-purple-400" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-1 text-purple-200/80 text-sm">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              
              {/* Enhanced divider */}
              <div className="flex items-center mt-8 justify-center">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                <span className="text-purple-300 text-xs font-medium px-4 py-1.5 flex items-center gap-1.5 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Workflow
                </span>
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced bottom border */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </div>
        
        {/* Right side: Enhanced glass form */}
        <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-4 md:p-8 relative">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '15s' }}></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s' }}></div>
          </div>
          
          {/* Glass form card with enhanced effects */}
          <Card className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden rounded-2xl">
            {/* Subtle light reflection effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-md transform rotate-45"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-t from-white/5 to-transparent rounded-full blur-md"></div>
            
            {/* Colored edge glow */}
            <div className="absolute inset-0 rounded-2xl p-px z-[-1] bg-gradient-to-br from-purple-500/20 via-indigo-500/5 to-transparent opacity-50"></div>
            
            <CardHeader className="space-y-1 relative">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Sign In
              </CardTitle>
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
                          <Input 
                            placeholder="you@example.com" 
                            {...field} 
                            className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]" 
                          />
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
                          <Input 
                            type="password" 
                            {...field} 
                            className="bg-white/[0.02] border-white/10 focus:border-purple-500 transition-colors focus:bg-white/[0.03]" 
                          />
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
                    className="w-full relative group overflow-hidden"
                    disabled={isLoading}
                  >
                    {/* Button background with gradient & glow */}
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"></span>
                    
                    {/* Light reflection effect */}
                    <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                      <span className="absolute -top-10 -left-10 w-20 h-20 bg-white/60 rounded-full blur-md transform rotate-12 translate-x-0 group-hover:translate-x-[400%] transition-transform duration-700"></span>
                    </span>
                    
                    {/* Button content */}
                    <span className="relative text-white">
                      {isLoading ? "Signing in..." : "Sign In"}
                    </span>
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

