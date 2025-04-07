
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Custom404PageProps {
  title: string;
  description: string;
  returnToHomepageLink: string;
}

export const Custom404Page: React.FC<Custom404PageProps> = ({
  title,
  description,
  returnToHomepageLink
}) => {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to={returnToHomepageLink}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
