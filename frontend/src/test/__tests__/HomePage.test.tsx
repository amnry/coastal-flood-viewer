import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Coastal Flood Viewer')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HomePage />);
    expect(screen.getByText('Sea Level Explorer')).toBeInTheDocument();
    expect(screen.getByText('Flood Mapper')).toBeInTheDocument();
    expect(screen.getByText('Hurricane Impact')).toBeInTheDocument();
    expect(screen.getByText('Data Catalog')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders quick start section', () => {
    render(<HomePage />);
    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    expect(screen.getByText('Explore Sea Level Data')).toBeInTheDocument();
    expect(screen.getByText('Map Flood Risks')).toBeInTheDocument();
  });
});
