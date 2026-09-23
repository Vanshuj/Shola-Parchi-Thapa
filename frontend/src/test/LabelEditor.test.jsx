import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LabelEditor from '@/components/labels/LabelEditor';
const BASE_LABELS = { TYPE_1: 'Mummy', TYPE_2: 'Papa', TYPE_3: 'Didi', TYPE_4: 'Bhaiya' };
describe('LabelEditor', () => {
    it('shows a validation error when a label is cleared', () => {
        const handleChange = () => { };
        render(<LabelEditor labels={BASE_LABELS} onChange={handleChange}/>);
        const input = screen.getByLabelText('Label for TYPE_1');
        fireEvent.change(input, { target: { value: '' } });
        expect(screen.getByText('Label cannot be empty')).toBeInTheDocument();
    });
    it('shows a validation error past the character limit', () => {
        const handleChange = () => { };
        render(<LabelEditor labels={BASE_LABELS} onChange={handleChange}/>);
        const input = screen.getByLabelText('Label for TYPE_2');
        fireEvent.change(input, { target: { value: 'ThisLabelIsWayTooLong' } });
        expect(screen.getByText('Max 12 characters')).toBeInTheDocument();
    });
});
