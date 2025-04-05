
import React from 'react';
import { ContactRecord } from '@/services/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User, Briefcase } from 'lucide-react';

interface ContactsListProps {
  contacts: ContactRecord[];
  className?: string;
}

export function ContactsList({ contacts, className = '' }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <p className="text-muted-foreground">No contacts found for this client</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {contacts.map((contact) => (
        <Card key={contact.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {contact.name}
                  {contact.is_primary && <Badge variant="default">Primary</Badge>}
                </CardTitle>
                {contact.position && (
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    {contact.position}
                  </CardDescription>
                )}
              </div>
              <Badge variant="outline">{contact.contact_type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}
              
              {contact.mobile && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <a href={`tel:${contact.mobile}`} className="text-sm hover:underline">
                    {contact.mobile} (Mobile)
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
