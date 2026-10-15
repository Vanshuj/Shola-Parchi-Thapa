import { Link } from 'react-router-dom';
import Icon from '@/components/common/Icon';

const DPDP_RIGHTS = [
  {
    icon: 'manage_search',
    title: 'Right to Access Information (Section 11)',
    body: 'You have the right to obtain a summary of your personal data processed by Solah Parchi Thap, the identities of all data processors, and any additional information specified under the Act.',
  },
  {
    icon: 'edit_note',
    title: 'Right to Correction & Erasure (Section 12)',
    body: 'You may correct inaccurate or misleading personal data, complete incomplete records, or request complete erasure of your account and match history at any time through Settings or direct request.',
  },
  {
    icon: 'support_agent',
    title: 'Right of Grievance Redressal (Section 13)',
    body: 'You have the right to have your data protection complaints resolved by our designated Grievance Redressal Officer within the statutory period of 30 days.',
  },
  {
    icon: 'person_add',
    title: 'Right to Nominate (Section 14)',
    body: 'You retain the right to designate another individual who may, in the event of death or incapacity, exercise your data principal rights on your behalf.',
  },
];

const PRIVACY_SECTIONS = [
  {
    icon: 'shield',
    title: '1. What Information We Collect (Data Minimization)',
    body: 'We collect only the minimum data required to deliver authentic parlor gaming: your chosen username, email address, and a cryptographically salted password hash (BCrypt). During active play, we process transient match cards, move turns, and calculate leaderboard Elo standings.',
    note: 'Principle of Data Minimization (Section 8(1)): We do NOT collect payment cards, Aadhaar or government IDs, biometric data, phone numbers, precise physical locations, or contacts.',
  },
  {
    icon: 'lock',
    title: '2. Client-Side Private Handwritten Chit Labels',
    body: 'Solah Parchi Thap allows you to personalize your 4 card quartets with nostalgic family nicknames, Bollywood references, or regional snacks. To guarantee privacy, your custom label strings are stored strictly on your local device browser storage.',
    note: 'Architectural Privacy Boundary: Active WebSocket gameplay channels broadcast only abstract suit identifiers (TYPE_1 through TYPE_4). Other players and spectators never receive your custom card names.',
  },
  {
    icon: 'sync_alt',
    title: '3. Real-Time Gameplay & Ephemeral Session Data',
    body: 'In-game events, including card handoffs, turn countdowns, and slap declarations, are processed in real-time by our authoritative game server. Active room state is maintained in volatile memory during the match and converted into summary win/loss statistics upon match conclusion.',
    note: 'Storage Limitation (Section 8(7)): Detailed turn buffer history is erased immediately once all players exit the baithak.',
  },
  {
    icon: 'child_care',
    title: '4. Processing of Children’s Personal Data (Section 9)',
    body: 'Solah Parchi is a beloved family folk tradition enjoyed across generations. In strict accordance with Section 9 of the DPDP Act 2023, we do not undertake behavioral tracking or profiling of minors, nor do we serve targeted advertising. Users under 18 years of age must participate only with verifiable parental or guardian consent.',
    note: 'No Harmful Processing: We do not process children’s data in any manner detrimental to their well-being.',
  },
  {
    icon: 'visibility_off',
    title: '5. Zero Advertising, Zero Surveillance Trackers',
    body: 'We do not run third-party advertising networks, surveillance analytics (such as Meta Pixel or Hotjar), or behavioral advertising. We never sell, rent, or trade your personal data or gameplay patterns to data brokers.',
    note: 'First-Party Only: Server telemetry is strictly limited to anonymized error rates and operational latency metrics required for server stability.',
  },
  {
    icon: 'undo',
    title: '6. Unconditional Right to Withdraw Consent (Section 6(4))',
    body: 'Your consent is completely voluntary. Under Section 6(4) of the DPDP Act, you have the right to withdraw your consent to data processing at any time as easily as it was given. You can clear local preferences, revoke cookie consent, or request complete account erasure via Settings or by emailing our Grievance Officer.',
    note: 'Effect of Withdrawal: Upon receiving a withdrawal request, we will cease processing your personal data unless required under applicable law.',
  },
];

export default function PrivacyPolicyPage() {
  function handleOpenCookieSettings() {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  }

  return (
    <div className="max-w-4xl mx-auto px-space-md lg:px-margin py-space-xl text-left">
      {/* Policy Hero Card */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Legal &amp; Data Protection
            </span>
            <span className="px-space-sm py-0.5 rounded-md bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              India DPDP Act 2023 Compliant
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs font-bold">
            Privacy Policy &amp; Data Notice
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Published pursuant to Section 5 of India&rsquo;s Digital Personal Data Protection Act, 2023. Solah Parchi Thap respects your privacy, safeguards your heritage baithak sessions, and provides total control over your digital personal data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            to="/cookies"
            className="inline-flex items-center gap-space-xs rounded-lg bg-secondary-container px-space-md py-space-sm font-label-md text-label-md font-bold text-on-secondary-container hover:brightness-95 transition-all shadow-sm"
          >
            <Icon name="cookie" size={18} />
            <span>Cookies Policy</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-space-xs rounded-lg border border-outline px-space-md py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <Icon name="arrow_back" size={18} />
            <span>Back to Baithak</span>
          </Link>
        </div>
      </div>

      {/* Statutory Notice Card under Section 5 */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/60 p-space-lg mb-space-xl">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="assignment" size={22} className="text-secondary" />
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Statutory Notice under Section 5, DPDP Act 2023
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
          Before collecting any personal data from you, <strong>Solah Parchi Thap Interactive Games</strong> (the &ldquo;Data Fiduciary&rdquo;) provides you with the following notice:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md text-xs text-on-surface-variant">
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-bold text-on-surface block mb-1">1. Personal Data Collected:</span>
            <p>Username, email address, salted password hash, gameplay match records, and voluntary feedback submissions.</p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-bold text-on-surface block mb-1">2. Specified Purpose of Processing:</span>
            <p>Player account authentication, multiplayer room matchmaking, real-time card game synchronization, Elo rating, and answering inquiries.</p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-bold text-on-surface block mb-1">3. Exercising Your Rights:</span>
            <p>You may exercise rights of Access, Correction, Erasure, and Grievance directly via Settings or by writing to <a href="mailto:grievance@solahparchithap.in" className="text-primary underline">grievance@solahparchithap.in</a>.</p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-bold text-on-surface block mb-1">4. Escalation to DPBI:</span>
            <p>If your grievance is not resolved to your satisfaction within 30 days, you retain the statutory right to file a complaint before the Data Protection Board of India.</p>
          </div>
        </div>
      </div>

      {/* Core Privacy Policy Sections */}
      <div className="space-y-space-lg mb-space-xl">
        {PRIVACY_SECTIONS.map((sec) => (
          <article
            key={sec.title}
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-space-lg shadow-sm"
          >
            <div className="flex items-start gap-space-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name={sec.icon} size={22} />
              </div>
              <div className="flex-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                  {sec.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
                  {sec.body}
                </p>
                <div className="rounded-lg bg-surface-container-low border-l-4 border-secondary p-space-sm">
                  <p className="font-body-sm text-body-sm text-secondary font-medium">
                    {sec.note}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Rights of the Data Principal under DPDP Act */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg mb-space-xl">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="verified_user" size={24} className="text-secondary" />
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Rights of Data Principals (Sections 11–14, DPDP Act 2023)
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
          As a user of Solah Parchi Thap residing in India or accessing Indian digital services, the law guarantees you the following inalienable rights:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {DPDP_RIGHTS.map((r) => (
            <div key={r.title} className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon name={r.icon} size={20} className="text-secondary" />
                <h3 className="font-label-md text-label-md font-bold text-on-surface">{r.title}</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grievance Redressal & Business Details Box */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-space-lg">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold flex items-center gap-2">
          <Icon name="contact_mail" size={22} className="text-secondary" />
          <span>Data Fiduciary &amp; Grievance Redressal Contact</span>
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
          In compliance with Section 8(10) of the DPDP Act 2023, the details of the Data Fiduciary and its designated Grievance Officer are set forth below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md text-xs mb-space-md">
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-label-sm uppercase text-secondary font-bold block mb-1">
              Data Fiduciary Business Entity
            </span>
            <p className="font-bold text-on-surface">Solah Parchi Thap Interactive Games</p>
            <p className="text-on-surface-variant">Heritage Courtyard, C-Scheme, Jaipur, Rajasthan 302001, India</p>
            <p className="text-on-surface-variant mt-1">General Inquiries: <a href="mailto:support@solahparchithap.in" className="text-primary hover:underline">support@solahparchithap.in</a></p>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-label-sm uppercase text-secondary font-bold block mb-1">
              Designated Grievance Redressal Officer
            </span>
            <p className="font-bold text-on-surface">Vanshika Jain</p>
            <p className="text-on-surface-variant">Designation: Data Protection &amp; Grievance Redressal Officer</p>
            <p className="text-on-surface-variant">Email: <a href="mailto:grievance@solahparchithap.in" className="text-primary hover:underline">grievance@solahparchithap.in</a></p>
            <p className="text-[11px] text-secondary font-semibold mt-1">Statutory Response: Acknowledgment &lt; 48 hours; Resolution &lt; 30 days</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-md pt-2 border-t border-outline-variant/30">
          <Link
            to="/feedback"
            className="rounded-lg bg-primary px-space-lg py-space-sm font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-colors shadow-sm"
          >
            Submit Grievance or Inquiry
          </Link>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            className="rounded-lg border border-outline px-space-lg py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Adjust Cookie Preferences
          </button>
          <Link
            to="/terms"
            className="rounded-lg border border-outline px-space-lg py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
