'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Sparkles, ThumbsUp, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/star-rating';
import { ReviewCard } from '@/components/review-card';
import { mockHotels, mockReviews } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hotel = mockHotels.find((h) => h.id === id);
  const hotelReviews = mockReviews.filter((r) => r.hotelId === id);

  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState(hotelReviews);

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Hotel Not Found</h1>
        <Link href="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const review = {
      id: String(Date.now()),
      hotelId: hotel.id,
      hotelName: hotel.name,
      userId: '1',
      userName: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '' });
    setIsSubmitting(false);
  };

  const sentimentColor = {
    positive: 'text-green-600 bg-green-50',
    neutral: 'text-amber-600 bg-amber-50',
    negative: 'text-red-600 bg-red-50',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={hotel.imageUrl}
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
                <p className="text-foreground leading-relaxed">{hotel.aiSummary}</p>
                
                {hotel.aiHighlights && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {hotel.aiHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hotel.aiSentiment && (
                  <div className="flex items-center gap-2 pt-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Overall Sentiment:</span>
                    <span
                      className={cn(
                        'text-sm font-medium px-2 py-0.5 rounded-full capitalize',
                        sentimentColor[hotel.aiSentiment]
                      )}
                    >
                      {hotel.aiSentiment}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
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
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
