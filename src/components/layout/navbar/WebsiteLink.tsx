
interface WebsiteLinkProps {
  url: string;
}

export function WebsiteLink({ url }: WebsiteLinkProps) {
  return (
    <a href={url} className="text-xs text-muted-foreground">
      {url}
    </a>
  );
}
