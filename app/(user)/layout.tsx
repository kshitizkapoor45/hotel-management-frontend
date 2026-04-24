'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      <main>{children}</main>
    </div>
  );
}
