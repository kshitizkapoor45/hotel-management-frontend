'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/components/review-card';
import { EmptyState } from '@/components/empty-state';
import { useGetUserRatingsQuery } from '@/lib/store/services/ratingApi';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MyReviewsPage() {
  const { data: userRatings, isLoading, error } = useGetUserRatingsQuery();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (reviewId: string) => {
    // API delete not yet implemented, for now just a placeholder
    setDeleteConfirm(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Manage your hotel reviews
            </p>
          </div>
          <Link href="/explore">
            <Button>Explore Hotels</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : userRatings && userRatings.length > 0 ? (
          <div className="space-y-4">
            {userRatings.map((item) => (
              <ReviewCard
                key={item.rating.id}
                review={{
                  id: item.rating.id,
                  hotelId: item.rating.hotelId,
                  hotelName: item.hotel.name,
                  userId: item.rating.userId,
                  userName: 'You',
                  rating: item.rating.rating,
                  comment: item.rating.feedback,
                  createdAt: new Date().toISOString(), // Fallback
                }}
                showHotelName
                onDelete={(id) => setDeleteConfirm(id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No Reviews Yet"
            description="You haven't written any reviews yet. Explore hotels and share your experiences!"
            actionLabel="Explore Hotels"
            onAction={() => window.location.href = '/explore'}
          />
        )}
      </div>


      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
