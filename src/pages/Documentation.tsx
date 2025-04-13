
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Code, HelpCircle } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <PageHeader
        title="Documentation"
        description="Access system documentation and guides"
        breadcrumbs={[{ label: "Documentation" }]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>User Guides</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Step-by-step instructions for common tasks and features.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Getting Started Guide</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Client Management</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Contract Administration</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Code className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Technical Reference</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Technical documentation for developers and administrators.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>API Documentation</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Database Schema</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Integration Points</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Help Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Troubleshooting and support resources.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>FAQ</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Contact Support</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Troubleshooting Guide</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This section contains detailed documentation about the system components, architecture, and workflows.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Core Modules</h3>
              <ul className="space-y-1 text-sm">
                <li>Client Management</li>
                <li>Site Management</li>
                <li>Contract Management</li>
                <li>Work Order Processing</li>
                <li>Supplier Management</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Workflows</h3>
              <ul className="space-y-1 text-sm">
                <li>Client Onboarding</li>
                <li>Contract Creation</li>
                <li>Work Order Lifecycle</li>
                <li>Supplier Integration</li>
                <li>Billing Process</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">APIs & Integration</h3>
              <ul className="space-y-1 text-sm">
                <li>API Reference</li>
                <li>Authentication</li>
                <li>Webhooks</li>
                <li>Third-party Integrations</li>
                <li>Data Export/Import</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;
