'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { RateHotelDialog } from '@/components/rate-hotel-dialog';
import { Hotel } from '@/lib/types';
import { Star } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  featured?: boolean;
}

export function HotelCard({ hotel, featured = false }: HotelCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'min-w-[300px] flex-shrink-0' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={hotel.imageUrl}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={featured}
        />
        {featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            AI Recommended
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-1">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{hotel.location}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={hotel.rating} size="sm" />
          <span className="text-sm font-medium text-foreground">{hotel.rating}</span>
          <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
        </div>
        {featured && hotel.aiSummary && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{hotel.aiSummary}</p>
        )}
        <div className="flex gap-2 mt-4">
          <Link href={`/hotels/${hotel.id}`} className="flex-1">
            <Button className="w-full" variant={featured ? 'default' : 'outline'}>
              View Details
            </Button>
          </Link>
          <RateHotelDialog 
            hotelId={hotel.id} 
            hotelName={hotel.name}
            trigger={
              <Button variant="ghost" size="icon" className="shrink-0 border">
                <Star className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
