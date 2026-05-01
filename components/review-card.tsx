'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { Review } from '@/lib/types';
import { Pencil, Trash2, User } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  showHotelName?: boolean;
  editable?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({
  review,
  showHotelName = false,
  editable = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const formattedDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Recently';

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{review.userName}</span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {showHotelName && (
                <p className="text-sm text-primary font-medium mt-0.5">{review.hotelName}</p>
              )}
              <p className="text-sm text-muted-foreground mt-0.5">{formattedDate}</p>
            </div>
          </div>
          {editable && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(review)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete?.(review.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-foreground mt-3 leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
