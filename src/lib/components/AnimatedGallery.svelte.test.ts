// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AnimatedGallery from './AnimatedGallery.svelte';

describe('AnimatedGallery', () => {
	it('should render movie list', () => {
		const { getByText } = render(AnimatedGallery);

		// Check initial movies are rendered
		expect(getByText('Nebula Heist')).toBeTruthy();
		expect(getByText('Glass Harbor')).toBeTruthy();
	});

	it('should have accessible controls', () => {
		const { getByLabelText } = render(AnimatedGallery);

		// Check ARIA labels exist
		expect(getByLabelText('New movie title')).toBeTruthy();
	});
});
