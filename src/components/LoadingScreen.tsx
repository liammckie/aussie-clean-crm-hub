
import { LoadingSpinner } from './ui/spinner';

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Loading app...</p>
      </div>
    </div>
  );
}
