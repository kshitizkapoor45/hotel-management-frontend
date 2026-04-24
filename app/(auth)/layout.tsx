import { Hotel } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Hotel className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">StayWise</span>
      </Link>
      {children}
    </div>
  );
}
