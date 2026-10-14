import { useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export const COOKIE_CONSENT_KEY = 'spt_cookie_consent';

export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences) {
  try {
    const data = {
      necessary: true,
      functional: Boolean(preferences.functional),
      thirdParty: Boolean(preferences.thirdParty),
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: data }));
    return data;
  } catch (e) {
    console.error('Could not save cookie consent:', e);
    return null;
  }
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      // First visit - show banner
      setVisible(true);
    } else {
      setFunctional(Boolean(existing.functional));
      setThirdParty(Boolean(existing.thirdParty));
    }

    function handleOpenPreferences() {
      const current = getCookieConsent();
      if (current) {
        setFunctional(Boolean(current.functional));
        setThirdParty(Boolean(current.thirdParty));
      }
      setModalOpen(true);
    }

    window.addEventListener('open-cookie-preferences', handleOpenPreferences);
    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenPreferences);
    };
  }, []);

  function handleAcceptAll() {
    saveCookieConsent({ functional: true, thirdParty: true });
    setFunctional(true);
    setThirdParty(true);
    setVisible(false);
    setModalOpen(false);
  }

  function handleRejectNonEssential() {
    saveCookieConsent({ functional: false, thirdParty: false });
    setFunctional(false);
    setThirdParty(false);
    setVisible(false);
    setModalOpen(false);
  }

  function handleSavePreferences() {
    saveCookieConsent({ functional, thirdParty });
    setVisible(false);
    setModalOpen(false);
  }

  return (
    <>
      {/* Floating Bottom Banner */}
      {visible && !modalOpen && (
        <aside
          role="region"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="fixed bottom-0 inset-x-0 z-50 p-space-sm sm:p-space-md bg-surface-container-lowest/95 dark:bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/80 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex-1 pr-space-md">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="cookie" size={20} className="text-secondary" />
                <h2 id={titleId} className="font-title-md text-title-md font-bold text-on-surface">
                  Cookie &amp; Privacy Notice
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  India DPDP Act 2023 Compliant
                </span>
              </div>
              <p id={descId} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                We use strictly essential local tokens to run multiplayer matches, keep your session secure, and remember
                your game state. We do not use third-party tracking or surveillance ads. In accordance with India&rsquo;s Digital Personal Data Protection Act, 2023, you have full control over your preferences.
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs">
                <Link to="/cookies" className="text-primary font-bold hover:underline">
                  Read Cookies Policy
                </Link>
                <span className="text-outline-variant" aria-hidden="true">•</span>
                <Link to="/privacy" className="text-primary font-bold hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-space-md py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Customize cookie and storage preferences"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-space-md py-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Reject non-essential cookies and keep only strictly necessary storage"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Accept all cookies and preferences"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setModalOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/80 p-space-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <Icon name="tune" size={22} className="text-secondary" />
                <h2 id="cookie-modal-title" className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Cookie &amp; Storage Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                aria-label="Close cookie preferences dialog"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="overflow-y-auto py-space-md space-y-space-md flex-1 pr-1 text-left">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Under India&rsquo;s Digital Personal Data Protection (DPDP) Act, 2023, you can choose which local storage categories you permit Solah Parchi Thap to use.
              </p>

              {/* Necessary */}
              <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md font-bold text-on-surface">
                        Strictly Necessary Storage
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-[10px] font-bold text-secondary uppercase">
                        Always Active
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                      Essential for authentication (JWT bearer token), multiplayer room state, reconnect grace tokens, and security. Cannot be switched off without breaking core game functionality.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    aria-label="Strictly Necessary Storage (Always Active)"
                    className="h-5 w-5 rounded accent-primary mt-1 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              {/* Functional */}
              <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label htmlFor="pref-functional" className="font-label-md text-label-md font-bold text-on-surface cursor-pointer">
                      Functional &amp; Experience Storage
                    </label>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                      Preserves your Day/Night Baithak theme, classical ambient audio track and volume settings, avatar selection, and your custom handwritten chit labels directly on your personal device.
                    </p>
                  </div>
                  <input
                    id="pref-functional"
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="h-5 w-5 rounded accent-primary mt-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Third-Party Embeds */}
              <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label htmlFor="pref-thirdparty" className="font-label-md text-label-md font-bold text-on-surface cursor-pointer">
                      Third-Party Embeds &amp; External Integrations
                    </label>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                      Controls whether external third-party embeds (such as embedded Google Forms on the feedback page) are permitted to load directly on page load. When disabled, third-party embeds require manual click-to-load confirmation.
                    </p>
                  </div>
                  <input
                    id="pref-thirdparty"
                    type="checkbox"
                    checked={thirdParty}
                    onChange={(e) => setThirdParty(e.target.checked)}
                    className="h-5 w-5 rounded accent-primary mt-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-space-md border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-space-md py-2 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container transition-colors"
              >
                Reject Non-Essential
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-space-md py-2 rounded-lg border border-secondary text-secondary font-label-md text-label-md font-bold hover:bg-secondary/10 transition-colors"
                >
                  Save My Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors shadow-sm"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
