import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/50', className)}
      {...props}
    />
  );
}

// Card Skeleton Component
export { Skeleton };

export function CardSkeleton() {
  return (
    <div className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft rounded-lg border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-4 w-64" />
        <div className="space-y-3 mt-6">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Skeleton
export function DashboardCardSkeleton() {
  return (
    <div className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft rounded-lg border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 max-w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-16 max-w-full" />
          <Skeleton className="h-3 w-32 max-w-full" />
          <Skeleton className="h-9 w-full mt-4" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Activity Skeleton
export function DashboardActivitySkeleton() {
  return (
    <div className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft rounded-lg border p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-muted/30 border border-border/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft rounded-lg border p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 rounded-xl border">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Header Skeleton
export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </header>
  );
}

// Page Layout Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <HeaderSkeleton />
      <main className="container mx-auto px-6 py-8">
        <CardSkeleton />
      </main>
    </div>
  );
}
