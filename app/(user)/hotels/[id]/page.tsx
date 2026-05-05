'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Sparkles, ThumbsUp, TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/star-rating';
import { ReviewCard } from '@/components/review-card';
import { cn } from '@/lib/utils';
import { useGetHotelByIdQuery } from '@/lib/store/services/hotelApi';
import { useCreateRatingMutation } from '@/lib/store/services/ratingApi';
import { useAuth } from '@/lib/store/useAuth';
import { toast } from 'sonner';

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useGetHotelByIdQuery(id);
  const [createRating, { isLoading: isSubmitting }] = useCreateRatingMutation();
  const { isAuthenticated, logIn } = useAuth();

  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Hotel</h1>
          <p className="text-muted-foreground mb-6">
            {error && 'status' in error ? `Error: ${error.status}` : 'We couldn\'t find the hotel you\'re looking for.'}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/explore">
              <Button variant="outline">Back to Explore</Button>
            </Link>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const { hotel, aiReview, ratings } = data;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    try {
      await createRating({
        hotelId: hotel.id,
        rating: newReview.rating,
        feedback: newReview.comment,
      }).unwrap();

      setNewReview({ rating: 0, comment: '' });
      toast.success('Review submitted successfully!');
      refetch(); // Refresh hotel data to see new rating
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={hotel.imageUrl || '/placeholder-hotel.jpg'}
          alt={hotel.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/explore">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        {/* Hotel Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={hotel.rating} size="lg" />
                  <span className="text-xl font-semibold text-foreground">{hotel.rating}</span>
                  <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">{hotel.about}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{aiReview.summary}</p>
                
                {aiReview.pros && aiReview.pros.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Pros
                    </h4>
                    <ul className="space-y-2">
                      {aiReview.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiReview.cons && aiReview.cons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      Cons
                    </h4>
                    <ul className="space-y-2">
                      {aiReview.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Reviews ({ratings.length})
              </h2>
              {ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.map((r, index) => (
                    <ReviewCard 
                      key={index} 
                      review={{
                        id: String(index),
                        hotelId: hotel.id,
                        hotelName: hotel.name,
                        userId: 'anonymous',
                        userName: 'Guest',
                        rating: r.rating,
                        comment: r.feedback,
                        createdAt: ''
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar - Add Review */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Your Rating</Label>
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={newReview.rating}
                          size="lg"
                          interactive
                          onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                        />
                        {newReview.rating > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {newReview.rating}/5
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience at this hotel..."
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || newReview.rating === 0 || !newReview.comment.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : 'Submit Review'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-muted-foreground">
                      Please sign in to share your experience and rate this hotel.
                    </p>
                    <Button onClick={() => logIn()} className="w-full">
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
