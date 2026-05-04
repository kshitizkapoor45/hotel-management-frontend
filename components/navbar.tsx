'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, Search, Menu, X, User, LogOut, Compass, MessageSquare, Settings, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/store/useAuth';

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logIn, logOut, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Links visible to everyone
  const publicLinks = [
    { href: '/explore', label: 'Explore', icon: Compass },
  ];

  // Links visible only to logged-in users
  const privateLinks = [
    { href: '/my-reviews', label: 'My Reviews', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: Settings },
  ];

  // Link only for admins
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Lock },
  ];

  const currentNavLinks = token 
    ? [...publicLinks, ...privateLinks, ...(isAdmin ? adminLinks : [])] 
    : publicLinks;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/explore" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Hotel className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">StayWise</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    pathname === link.href && 'bg-primary/10 text-primary'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu / Login Section */}
          <div className="flex items-center gap-2">
            {mounted && (
              <>
                {token ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-reviews" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          My Reviews
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logOut()} className="flex items-center gap-2 text-destructive">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => logIn()} variant="ghost" size="sm">
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => logIn({ kc_action: 'register' })} 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-3 space-y-1">
            {currentNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    pathname === link.href && 'bg-primary/10 text-primary'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
