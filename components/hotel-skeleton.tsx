import { Card, CardContent } from '@/components/ui/card';

export function HotelSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-2" />
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>
        <div className="h-10 bg-muted rounded animate-pulse w-full mt-4" />
      </CardContent>
    </Card>
  );
}

export function HotelSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <HotelSkeleton key={i} />
      ))}
    </div>
  );
}
