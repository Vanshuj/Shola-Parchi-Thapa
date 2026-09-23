import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ParchiCard from '@/components/game/ParchiCard';
describe('ParchiCard', () => {
    it('renders the custom label for the card', () => {
        render(<ParchiCard card={{ id: 'c1', type: 'TYPE_1', label: 'Mummy' }}/>);
        expect(screen.getByText('Mummy')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Mummy/i })).toBeInTheDocument();
    });
    it('marks itself pressed when selected', () => {
        render(<ParchiCard card={{ id: 'c2', type: 'TYPE_2', label: 'Papa' }} selected/>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
});
