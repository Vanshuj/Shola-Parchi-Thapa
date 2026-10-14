import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CookieConsentBanner, { COOKIE_CONSENT_KEY, getCookieConsent } from '@/components/common/CookieConsentBanner';
import feedbackApi from '@/api/feedbackApi';
import Input from '@/components/common/Input';

describe('Compliance & Accessibility Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('CookieConsentBanner (DPDP Act & ePrivacy compliance)', () => {
    it('renders cookie consent banner on first visit when no consent is saved', () => {
      render(
        <BrowserRouter>
          <CookieConsentBanner />
        </BrowserRouter>
      );

      expect(screen.getByRole('region', { name: /cookie & privacy notice/i })).toBeInTheDocument();
      expect(screen.getByText(/India DPDP Act 2023 Compliant/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reject non-essential/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument();
    });

    it('saves rejection of non-essential cookies properly in localStorage', () => {
      render(
        <BrowserRouter>
          <CookieConsentBanner />
        </BrowserRouter>
      );

      const rejectBtn = screen.getByRole('button', { name: /reject non-essential/i });
      fireEvent.click(rejectBtn);

      const consent = getCookieConsent();
      expect(consent).not.toBeNull();
      expect(consent.necessary).toBe(true);
      expect(consent.functional).toBe(false);
      expect(consent.thirdParty).toBe(false);
    });

    it('saves accept all cookies properly in localStorage', () => {
      render(
        <BrowserRouter>
          <CookieConsentBanner />
        </BrowserRouter>
      );

      const acceptBtn = screen.getByRole('button', { name: /accept all/i });
      fireEvent.click(acceptBtn);

      const consent = getCookieConsent();
      expect(consent).not.toBeNull();
      expect(consent.necessary).toBe(true);
      expect(consent.functional).toBe(true);
      expect(consent.thirdParty).toBe(true);
    });
  });

  describe('Fake Reviews Eradication (feedbackApi)', () => {
    it('does NOT contain hardcoded fake presets in getRecent', async () => {
      const recent = await feedbackApi.getRecent();
      // Should not contain Kabir V., Ananya Sharma, or Rohan Mehra fake reviews
      const usernames = recent.map((r) => r.username);
      expect(usernames).not.toContain('Kabir V.');
      expect(usernames).not.toContain('Ananya Sharma.');
      expect(usernames).not.toContain('Rohan Mehra');
      expect(recent).toEqual([]);
    });

    it('does NOT return inflated fake stats in getStats when offline', async () => {
      const stats = await feedbackApi.getStats();
      expect(stats.totalFeedback).toBe(0);
      expect(stats.categoryCounts).toEqual({});
    });
  });

  describe('Input Accessibility (ARIA & Keyboard Friendly)', () => {
    it('associates label with input id and links error message with role="alert"', () => {
      render(
        <Input
          label="Test Player Name"
          id="test-player"
          error="Username is mandatory"
        />
      );

      const input = screen.getByLabelText(/test player name/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-player');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'test-player-error');

      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveTextContent('Username is mandatory');
      expect(errorMsg).toHaveAttribute('id', 'test-player-error');
    });
  });
});
