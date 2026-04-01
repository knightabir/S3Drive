import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectionLoader from '../src/components/loaders/ConnectionLoader';

describe('ConnectionLoader', () => {
  it('renders status and key labels', () => {
    render(<ConnectionLoader />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Local System')).toBeInTheDocument();
    expect(screen.getByText('Global Internet')).toBeInTheDocument();
    expect(screen.getByText('Connecting…')).toBeInTheDocument();
  });

  it('exposes accessibility metadata', () => {
    render(<ConnectionLoader />);

    const status = screen.getByRole('status', {
      name: /connecting local system to global internet/i,
    });

    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('shows secure connection messaging', () => {
    render(<ConnectionLoader />);

    expect(screen.getByText('Encrypted handshake in progress.')).toBeInTheDocument();
  });
});
