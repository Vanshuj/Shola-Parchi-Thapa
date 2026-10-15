import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from '@/components/common/Icon';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { feedbackApi } from '@/api/feedbackApi';
import { useAuthStore } from '@/store/authStore';

const GOOGLE_FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSef1VevFMAbSFz9DOuzuKpcgoue3EypggIoer629CGK69r7YA/viewform?embedded=true';

const GOOGLE_FORM_DIRECT_URL = 'https://forms.gle/4isSZsShzK4B3Wpv7';

const feedbackSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  rating: z.coerce.number().min(1).max(5),
  subject: z.string().max(120, 'Subject must be under 120 characters').optional(),
  message: z.string().min(10, 'Feedback must be at least 10 characters long').max(2500, 'Under 2500 characters'),
  name: z.string().max(80).optional(),
  email: z.string().email('Please enter a valid email address').or(z.literal('')).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must provide consent for processing this feedback under the DPDP Act 2023.' }),
  }),
});

export default function FeedbackPage() {
  const username = useAuthStore((s) => s.username);
  const [activeTab, setActiveTab] = useState('native'); // 'native' | 'embed'
  const [embedConsentGiven, setEmbedConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: 'GENERAL',
      rating: 5,
      subject: '',
      message: '',
      name: username || '',
      email: '',
      consent: false,
    },
  });

  const selectedRating = watch('rating');

  async function onFormSubmit(data) {
    setSubmitting(true);
    setServerError(null);
    try {
      await feedbackApi.submitFeedback({
        category: data.category,
        rating: Number(data.rating),
        subject: data.subject?.trim() || undefined,
        message: data.message.trim(),
        name: data.name?.trim() || undefined,
        email: data.email?.trim() || undefined,
      });
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error('Feedback submission failed:', err);
      setServerError(
        err?.response?.data?.message || 'Could not send feedback. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-space-md lg:px-margin py-space-xl text-left">
      {/* Page Header */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Community Voice &amp; Grievance
            </span>
            <span className="px-space-sm py-0.5 rounded-md bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              India DPDP Act 2023 Compliant
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs font-bold">
            Feedback &amp; Grievance Redressal
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Help us refine the verandah experience. Share gameplay feedback, report bugs, suggest raga tracks, or contact our designated Grievance Redressal Officer.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/50 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('native')}
            className={`px-space-md py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'native'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            aria-selected={activeTab === 'native'}
          >
            Direct In-App Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`px-space-md py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'embed'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            aria-selected={activeTab === 'embed'}
          >
            Google Form (External)
          </button>
        </div>
      </div>

      {activeTab === 'native' && (
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-xl">
          {submitSuccess ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center mb-4">
                <Icon name="check_circle" size={36} className="text-secondary" />
              </div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                Dhanyawaad! Your Feedback is Received
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6 leading-relaxed">
                Thank you for contributing to the Solah Parchi Baithak. Inquiries requiring a response from our Grievance Redressal Officer will be acknowledged within 48 hours and resolved within 30 days under the DPDP Act 2023.
              </p>
              <Button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                variant="secondary"
                aria-label="Submit another feedback response"
              >
                Submit Another Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5" noValidate>
              {/* Privacy Notice on Data Minimization */}
              <div className="rounded-lg bg-surface-container-low border border-outline-variant/50 p-space-sm text-xs text-on-surface-variant flex items-start gap-2">
                <Icon name="verified_user" size={18} className="text-secondary shrink-0 mt-0.5" />
                <p>
                  <strong className="text-on-surface">Data Minimization:</strong> Your message and rating are all that is required. Name and email are strictly optional and only used if you request a personal reply from our support or grievance redressal team.
                </p>
              </div>

              {/* Category & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label htmlFor="feedback-category" className="font-label-md text-label-md font-bold text-on-surface block mb-1">
                    Category
                  </label>
                  <select
                    id="feedback-category"
                    {...register('category')}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-space-sm py-2 font-body-md text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="GENERAL">General Feedback</option>
                    <option value="GAMEPLAY">Gameplay &amp; Rules Mechanics</option>
                    <option value="AUDIO_MUSIC">Foley Audio &amp; Sangeet Tracks</option>
                    <option value="VISUALS_3D">3D Baithak Visuals &amp; Aesthetics</option>
                    <option value="SUGGESTION">Feature Suggestion</option>
                    <option value="PRIVACY_GRIEVANCE">Privacy &amp; DPDP Grievance</option>
                  </select>
                </div>

                <div>
                  <span className="font-label-md text-label-md font-bold text-on-surface block mb-1">
                    Experience Rating
                  </span>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValue('rating', star)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        className="p-1 rounded hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Icon
                          name="star"
                          size={28}
                          filled={star <= selectedRating}
                          className={star <= selectedRating ? 'text-secondary' : 'text-outline-variant'}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-label-md text-xs font-bold text-secondary">
                      {selectedRating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <Input
                label="Subject (Optional)"
                id="feedback-subject"
                placeholder="Brief summary of your note"
                {...register('subject')}
                error={errors.subject?.message}
              />

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label htmlFor="feedback-message" className="font-label-md text-label-md font-bold text-on-surface">
                  Message / Details <span className="text-error">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  rows={5}
                  placeholder="Tell us what worked smoothly, what needs tuning, or any questions for our team…"
                  {...register('message')}
                  className={`w-full rounded-lg border px-space-sm py-space-sm bg-surface-container-lowest text-on-surface font-body-md text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    errors.message ? 'border-error ring-1 ring-error/50' : 'border-outline-variant hover:border-outline'
                  }`}
                />
                {errors.message && (
                  <span role="alert" className="font-body-sm text-body-sm text-error font-medium">
                    {errors.message.message}
                  </span>
                )}
              </div>

              {/* Name & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <Input
                  label="Your Name (Optional)"
                  id="feedback-name"
                  placeholder="Khiladi or Baithak Sathi"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Contact Email (Optional)"
                  id="feedback-email"
                  type="email"
                  placeholder="For grievance response"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              {/* DPDP Consent Checkbox */}
              <div className="flex flex-col gap-1 pt-1">
                <label
                  htmlFor="feedback-consent"
                  className="flex items-start gap-2.5 text-xs text-on-surface cursor-pointer select-none"
                >
                  <input
                    id="feedback-consent"
                    type="checkbox"
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-2 mt-0.5 shrink-0 cursor-pointer"
                    {...register('consent')}
                  />
                  <span className="leading-tight">
                    I consent to the processing of this feedback submission under India&rsquo;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the platform{' '}
                    <a href="/privacy" target="_blank" className="text-primary font-bold underline">Privacy Policy</a>.
                  </span>
                </label>
                {errors.consent && (
                  <span role="alert" className="text-xs text-error font-medium pl-6">
                    {errors.consent.message}
                  </span>
                )}
              </div>

              {serverError && (
                <div role="alert" className="rounded-lg bg-error/10 border border-error/30 p-space-sm text-xs text-error flex items-center gap-2">
                  <Icon name="error" size={16} />
                  <span>{serverError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-space-xl"
                aria-label={submitting ? 'Submitting your feedback' : 'Submit feedback'}
              >
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </Button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'embed' && (
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-xl">
          {!embedConsentGiven ? (
            /* Third-Party Embed Consent Gate */
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/60 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center mb-3">
                <Icon name="security" size={24} className="text-secondary" />
              </div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                External Third-Party Service Disclosure
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-4 leading-relaxed">
                Loading an embedded Google Form connects your browser to Google LLC servers. Google may collect your IP address and set third-party functional cookies (e.g. NID, SID) on your browser according to{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-bold underline"
                >
                  Google&rsquo;s Privacy Policy
                </a>.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setEmbedConsentGiven(true)}
                  aria-label="Consent and load external Google Form embed"
                >
                  Load Embedded Form Here
                </Button>
                <a
                  href={GOOGLE_FORM_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-space-md py-2 rounded-lg border border-outline text-on-surface font-label-md font-bold hover:bg-surface-container-high transition-colors inline-flex items-center gap-1.5"
                  aria-label="Open Google Form in a new external browser tab"
                >
                  <span>Open Form in New Tab</span>
                  <Icon name="open_in_new" size={16} />
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full relative overflow-hidden rounded-xl border border-outline-variant/60 bg-white">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Google Forms External Feedback"
                width="100%"
                height="1050"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="w-full min-h-[850px] md:min-h-[1050px] border-0 bg-white block"
              >
                Loading Google Form…
              </iframe>
            </div>
          )}
        </div>
      )}

      {/* Statutory DPDP Grievance Redressal Information */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/40 p-space-md text-xs text-on-surface-variant">
        <h3 className="font-bold text-on-surface mb-1 flex items-center gap-1.5 text-sm">
          <Icon name="support_agent" size={16} className="text-secondary" />
          <span>Statutory Grievance Redressal (Section 8(10) &amp; Section 13, DPDP Act 2023)</span>
        </h3>
        <p className="leading-relaxed">
          If you have a formal data protection complaint or wish to exercise your rights of Access, Correction, Erasure, or Consent Withdrawal, you may address our designated Grievance Officer, <strong>Vanshika Jain</strong>, directly at{' '}
          <a href="mailto:grievance@solahparchithap.in" className="text-primary font-bold underline">
            grievance@solahparchithap.in
          </a>. Under the DPDP Act 2023, grievances are acknowledged within 48 hours and resolved within 30 days. If unsatisfied with the resolution, you retain the legal right to escalate the matter to the <strong>Data Protection Board of India (DPBI)</strong>.
        </p>
      </div>
    </div>
  );
}
