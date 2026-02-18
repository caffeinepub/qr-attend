import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container max-w-2xl mx-auto px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
