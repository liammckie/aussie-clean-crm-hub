
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NotFoundProps {
  title?: string;
  description?: string;
  returnLink?: string;
  returnLabel?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  description = "The page you are looking for doesn't exist or has been moved.",
  returnLink = "/dashboard",
  returnLabel = "Return to Dashboard"
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
            <Link to={returnLink}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {returnLabel}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
