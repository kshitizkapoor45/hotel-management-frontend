'use client';
// Force rebuild to fix 404

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HotelCard } from '@/components/hotel-card';
import { HotelSkeletonGrid } from '@/components/hotel-skeleton';
import { useGetHotelsQuery, useGetRecommendationsQuery, useLazySearchHotelsQuery } from '@/lib/store/services/hotelApi';
import { useAuth } from '@/lib/store/useAuth';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();
  const { data: hotels, isLoading: isLoadingHotels } = useGetHotelsQuery();
  const { data: recommendedHotels, isLoading: isLoadingRecommended } = useGetRecommendationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [triggerSearch, { data: searchResults, isFetching: isSearching }] = useLazySearchHotelsQuery();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setDebouncedQuery(searchQuery); // Still use debouncedQuery to switch views
      triggerSearch(searchQuery);
    } else {
      setDebouncedQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayHotels = debouncedQuery ? (searchResults || []) : (hotels || []);
  const isLoading = isLoadingHotels || isLoadingRecommended || isSearching;

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section with Search */}
      <section className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Discover Your Perfect Stay
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            AI-powered recommendations to find the ideal hotel for your next adventure
          </p>
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by hotel name or location..."
                className="pl-12 h-12 text-base bg-background border-border shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch} className="h-12 px-6">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* AI Recommended Hotels */}
      {!searchQuery && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={scrollLeft}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollRight}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoadingRecommended ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[300px] h-[350px] rounded-2xl bg-muted animate-pulse" />
              ))
            ) : !isAuthenticated ? (
              <p className="text-muted-foreground italic bg-muted/20 p-4 rounded-xl border border-dashed">Log in to see personalized recommendations based on your preferences.</p>
            ) : recommendedHotels && recommendedHotels.length > 0 ? (
              recommendedHotels.map((hotel) => (
                <div key={hotel.id} className="snap-start">
                  <HotelCard hotel={hotel} featured />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recommendations available at the moment.</p>
            )}
          </div>
        </section>
      )}

      {/* All Hotels Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Hotels'}
            {isSearching && <span className="text-sm font-normal text-muted-foreground animate-pulse">(Searching...)</span>}
          </h2>
          <span className="text-sm text-muted-foreground">
            {displayHotels.length} hotels found
          </span>
        </div>

        {isLoading ? (
          <HotelSkeletonGrid count={6} />
        ) : displayHotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hotels found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
