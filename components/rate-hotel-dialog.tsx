'use client';

import { useState } from 'react';
import { useCreateRatingMutation } from '@/lib/store/services/ratingApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/star-rating';
import { toast } from 'sonner';

interface RateHotelDialogProps {
  hotelId: string;
  hotelName: string;
  trigger?: React.ReactNode;
}

export function RateHotelDialog({ hotelId, hotelName, trigger }: RateHotelDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [createRating, { isLoading }] = useCreateRatingMutation();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await createRating({
        hotelId,
        rating,
        feedback,
      }).unwrap();
      
      toast.success('Rating submitted successfully!');
      setOpen(false);
      setRating(0);
      setFeedback('');
    } catch (err) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Rate Hotel</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate {hotelName}</DialogTitle>
          <DialogDescription>
            Share your experience with this hotel. Your feedback helps others!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Rating</Label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="feedback">Your Review</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what you liked or disliked..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || rating === 0}>
            {isLoading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
