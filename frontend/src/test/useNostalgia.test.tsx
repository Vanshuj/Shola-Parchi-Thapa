import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNostalgia } from '@/hooks/useNostalgia';
import { usePreferenceStore, DEFAULT_PREFERENCES } from '@/store/preferenceStore';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('useNostalgia', () => {
  beforeEach(() => {
    usePreferenceStore.setState({ preferences: DEFAULT_PREFERENCES });
  });

  it('keeps animations on when the OS has no reduced-motion preference', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useNostalgia());
    expect(result.current.cardAnimations).toBe(true);
  });

  it('disables animations and easter eggs when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useNostalgia());
    expect(result.current.cardAnimations).toBe(false);
    expect(result.current.easterEggs).toBe(false);
    expect(result.current.reduceMotion).toBe(true);
  });
});
