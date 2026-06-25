import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => {
  const MockIcon = ({ children, ...props }: any) => <span {...props}>{children}</span>;
  return {
    ArrowRight: MockIcon,
    Shield: MockIcon,
    Zap: MockIcon,
    Coins: MockIcon,
    Code2: MockIcon,
    CheckCircle2: MockIcon,
    FileCheck: MockIcon,
  };
});

// Mock shadcn button
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) return <>{children}</>;
    return <button {...props}>{children}</button>;
  },
}));

import LandingPage from '../app/page';

describe('Landing Page', () => {
  it('renders the hero headline', () => {
    render(<LandingPage />);
    expect(screen.getByText(/The Future of Business/i)).toBeInTheDocument();
    expect(screen.getByText(/Agreements is LexStellar/i)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('Immutable Integrity')).toBeInTheDocument();
    expect(screen.getByText('Instant Settlements')).toBeInTheDocument();
    expect(screen.getByText('Programmable Logic')).toBeInTheDocument();
  });

  it('has a Launch Platform CTA link', () => {
    render(<LandingPage />);
    const ctaLink = screen.getByText('Launch Platform').closest('a');
    expect(ctaLink).toHaveAttribute('href', '/dashboard');
  });
});
