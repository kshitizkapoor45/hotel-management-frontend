'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Pencil, Trash2, Plus, Building2 } from 'lucide-react';
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
import { mockHotels } from '@/lib/mock-data';
import { Hotel } from '@/lib/types';
import { StarRating } from '@/components/star-rating';
import { EmptyState } from '@/components/empty-state';

export default function HotelsAdminPage() {
  const [hotels, setHotels] = useState(mockHotels);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
  });

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ name: '', location: '', description: '', image: '' });
    setIsAddModalOpen(true);
  };

  const handleAdd = () => {
    const newHotel: Hotel = {
      id: String(Date.now()),
      name: formData.name,
      location: formData.location,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      rating: 0,
      reviewCount: 0,
      amenities: [],
    };
    setHotels([newHotel, ...hotels]);
    setIsAddModalOpen(false);
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      image: hotel.image,
    });
  };

  const handleSaveEdit = () => {
    if (!editingHotel) return;
    setHotels(
      hotels.map((h) =>
        h.id === editingHotel.id
          ? { ...h, ...formData }
          : h
      )
    );
    setEditingHotel(null);
  };

  const handleDelete = (hotelId: string) => {
    setHotels(hotels.filter((h) => h.id !== hotelId));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hotel Management</h1>
        <p className="text-muted-foreground mt-1">Manage hotel listings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Hotels</CardTitle>
              <CardDescription>{hotels.length} hotels listed</CardDescription>
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
          {filteredHotels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{hotel.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StarRating rating={hotel.rating} size="sm" />
                        <span>{hotel.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{hotel.reviewCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(hotel)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(hotel.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>Enter hotel information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A luxurious hotel with amazing views..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-image">Image URL</Label>
              <Input
                id="add-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/hotel.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!formData.name || !formData.location}>
              Add Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={!!editingHotel} onOpenChange={() => setEditingHotel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>Update hotel information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Hotel Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHotel(null)}>
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
            <DialogTitle>Delete Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hotel? This action cannot be undone.
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
