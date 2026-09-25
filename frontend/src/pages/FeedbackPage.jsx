import { useState } from 'react';

const GOOGLE_FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSef1VevFMAbSFz9DOuzuKpcgoue3EypggIoer629CGK69r7YA/viewform?embedded=true';

const GOOGLE_FORM_DIRECT_URL = 'https://forms.gle/4isSZsShzK4B3Wpv7';

export default function FeedbackPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full px-2 py-6 sm:px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center">
      {/* Fixed Google Form Container */}
      <div className="w-full relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-white shadow-2xl transition-all">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-container-low text-secondary gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-xs font-medium">Loading Feedback Form…</p>
          </div>
        )}

        <iframe
          src={GOOGLE_FORM_EMBED_URL}
          title="Feedback Form"
          width="100%"
          height="1050"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          onLoad={() => setLoaded(true)}
          className="w-full min-h-[850px] md:min-h-[1050px] border-0 bg-white block"
        >
          Loading…
        </iframe>
      </div>

      {/* Subtle direct link helper */}
      <div className="mt-3 text-center">
        <a
          href={GOOGLE_FORM_DIRECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-secondary hover:text-primary transition-colors underline"
        >
          Having trouble viewing the form? Click here to open it directly.
        </a>
      </div>
    </div>
  );
}
