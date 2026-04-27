'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Pencil, Trash2, Plus, Building2, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetHotelsQuery, useRegisterHotelMutation } from '@/lib/store/services/hotelApi';
import { StarRating } from '@/components/star-rating';
import { EmptyState } from '@/components/empty-state';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function HotelsAdminPage() {
  const { data: hotels = [], isLoading, isError } = useGetHotelsQuery();
  const [registerHotel, { isLoading: isRegistering }] = useRegisterHotelMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    about: '',
    amenities: '', // Input as comma-separated string
  });

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ name: '', location: '', about: '', amenities: '' });
    setIsAddModalOpen(true);
  };

  const handleAdd = async () => {
    try {
      // Split comma-separated string into array and clean up whitespace
      const amenitiesArray = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a !== '');

      await registerHotel({
        name: formData.name,
        location: formData.location,
        about: formData.about,
        amenities: amenitiesArray
      }).unwrap();
      
      toast.success('Hotel registered successfully!');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to register hotel:', error);
      toast.error('Failed to register hotel. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4">Fetching hotel listings...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hotel Management</h1>
        <p className="text-muted-foreground mt-1">Manage hotel listings and inventory</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Hotels</CardTitle>
              <CardDescription>{hotels.length} hotels synced from backend</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleOpenAdd} className="gap-2 flex-shrink-0">
                <Plus className="h-4 w-4" />
                Add Hotel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="text-center py-12 text-destructive">
              <p>Failed to load hotels. Please ensure the backend is running.</p>
            </div>
          ) : filteredHotels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-xs text-muted-foreground max-w-[200px] truncate">{hotel.about}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {hotel.amenities?.slice(0, 3).map((a, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] py-0">
                            {a}
                          </Badge>
                        ))}
                        {hotel.amenities?.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{hotel.amenities.length - 3} more</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled // Edit not implemented in backend yet
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled // Delete not implemented in backend yet
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Building2}
              title="No Hotels Found"
              description={searchQuery ? 'No hotels match your search.' : 'No hotels added yet.'}
              actionLabel="Add Hotel"
              onAction={handleOpenAdd}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Hotel Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>Enter hotel information for registration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Hotel Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="The Grand Hotel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-location">Location</Label>
                <Input
                  id="add-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Paris, France"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-about">About / Description</Label>
              <Textarea
                id="add-about"
                rows={3}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="A luxurious hotel with amazing views..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-amenities" className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Amenities
              </Label>
              <Textarea
                id="add-amenities"
                rows={2}
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Free WiFi, Swimming Pool, Fitness Center..."
                className="resize-none"
              />
              <p className="text-[10px] text-muted-foreground">Separate items with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isRegistering || !formData.name || !formData.location}>
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Add Hotel'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
