'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/components/review-card';
import { EmptyState } from '@/components/empty-state';
import { mockReviews } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/star-rating';
import { Review } from '@/lib/types';

export default function MyReviewsPage() {
  // Filter reviews by current user (user id: 1)
  const userReviews = mockReviews.filter((r) => r.userId === '1');
  const [reviews, setReviews] = useState(userReviews);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleSaveEdit = () => {
    if (!editingReview) return;
    
    setReviews(
      reviews.map((r) =>
        r.id === editingReview.id
          ? { ...r, rating: editForm.rating, comment: editForm.comment }
          : r
      )
    );
    setEditingReview(null);
  };

  const handleDelete = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
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

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showHotelName
                editable
                onEdit={handleEdit}
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

      {/* Edit Review Dialog */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review for {editingReview?.hotelName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating
                rating={editForm.rating}
                size="lg"
                interactive
                onRatingChange={(rating) => setEditForm({ ...editForm, rating })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-comment">Your Review</Label>
              <Textarea
                id="edit-comment"
                rows={4}
                value={editForm.comment}
                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReview(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
