'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Star, ArrowUpRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Hotels', value: '24', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: '1.2k', icon: Users, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your hotel management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-md overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color.replace('text', 'bg')}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-lg border-primary/5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used management tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/hotels">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <Building2 className="h-4 w-4" />
                Manage All Hotels
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <Users className="h-4 w-4" />
                Manage User Access
              </Button>
            </Link>
            <Button className="w-full justify-start gap-2 h-12">
              <Plus className="h-4 w-4" />
              Add New Hotel Listing
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card className="shadow-lg border-primary/5">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Server and database status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Cluster</span>
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Media Storage</span>
                <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                  Processing Load
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
