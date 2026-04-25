'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, Users, Building2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/store/useAuth';

const navItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/hotels', label: 'Hotels', icon: Building2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-card border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Hotel className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">StayWise</span>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                pathname === item.href && 'bg-primary/10 text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => logOut()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
