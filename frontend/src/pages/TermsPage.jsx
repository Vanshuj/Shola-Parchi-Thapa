import { Link } from 'react-router-dom';
import Icon from '@/components/common/Icon';

const TERMS_SECTIONS = [
  {
    icon: 'gavel',
    title: '1. Acceptance of Terms',
    body: 'By accessing or playing Solah Parchi Thap, creating an account, or joining a game baithak, you agree to comply with and be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any portion of these terms, please refrain from using the platform.',
    highlight: 'These terms apply to all visitors, registered players, and match participants.',
  },
  {
    icon: 'casino',
    title: '2. Non-Gambling, Cultural Recreation Declaration',
    body: 'Solah Parchi Thap is strictly a free-to-play cultural folk game revival intended solely for social entertainment and family nostalgia. The platform contains ZERO real-money gaming, ZERO wagering, ZERO stakes, and ZERO prize money convertible into cash or monetary equivalents.',
    highlight: 'Strict Prohibition: No player may use this platform for betting, wagering, or financial speculation. The platform is not a Real Money Gaming (RMG) service under Indian law.',
  },
  {
    icon: 'sports_esports',
    title: '3. Fair Play & Baithak Etiquette',
    body: 'Solah Parchi Thap is built to preserve a cherished cultural parlor tradition. All players are expected to compete fairly and respectfully. The use of automated bot injection scripts, network packet spoofing, exploit tools, or deliberate turn timeouts to disrupt matches is strictly prohibited.',
    highlight: 'Disruptive behavior or deliberate match abandonment may result in temporary or permanent matchmaking restrictions.',
  },
  {
    icon: 'badge',
    title: '4. Account Responsibilities & Data Protection',
    body: 'When creating an account, you agree to provide authentic username information and maintain the confidentiality of your credentials. In accordance with India’s Digital Personal Data Protection Act, 2023, you have the right to request account modification or complete account erasure at any time.',
    highlight: 'Usernames and room custom codes must not contain vulgar, defamatory, or abusive language.',
  },
  {
    icon: 'palette',
    title: '5. User-Customized Parchis Content',
    body: 'Our platform allows personalizing card labels for nostalgic and entertainment purposes (such as family nicknames or Indian street food). As detailed in our Privacy Policy, card label customizations are stored locally on your device and rendered strictly on your personal screen.',
    highlight: 'You agree not to input hateful, sexually explicit, defamatory, or unlawful phrases.',
  },
  {
    icon: 'hub',
    title: '6. Match Resolution & Simultaneous Slap Priority',
    body: 'Solah Parchi Thap relies on an authoritative server clock to arbitrate simultaneous events. In rare instances where two players complete four-of-a-kind on the same turn and slap within milliseconds, the server turn order and verified timestamp determine the round winner.',
    highlight: 'Server state arbitration is authoritative and final for round outcomes and Elo rating updates.',
  },
  {
    icon: 'copyright',
    title: '7. Intellectual Property & Digital Asset Copyright',
    body: 'While the game concept of Solah Parchi belongs to traditional Indian folk heritage, all bespoke software code, user interface designs, logos, 3D Baithak models, textures, audio compositions, and graphic illustrations are proprietary copyrighted works of Solah Parchi Thap Interactive Games (© 2026).',
    highlight: 'You may not scrape, reverse-engineer, mirror, or commercially exploit platform assets without express prior written permission.',
  },
  {
    icon: 'security_update_good',
    title: '8. Service Availability & Modifications',
    body: 'We strive to provide continuous uptime for community baithak matches, but we do not guarantee uninterrupted or error-free service. Maintenance windows, updates, and feature improvements may take place periodically with advance notice posted on the platform.',
    highlight: 'We reserve the right to modify these terms with revised dates published on this page.',
  },
  {
    icon: 'balance',
    title: '9. Governing Law & Dispute Resolution',
    body: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in Jaipur, Rajasthan or Bengaluru, Karnataka, India.',
    highlight: 'Disputes are resolved in accordance with Indian substantive and procedural law.',
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-space-md lg:px-margin py-space-xl text-left">
      {/* Page Header */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Legal &amp; Governance
            </span>
            <span className="px-space-sm py-0.5 rounded-md bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              September 2026 Revision
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs font-bold">
            Terms &amp; Conditions
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Please read these terms carefully before joining a room or creating an account. They govern fair play, intellectual property rights, non-gambling declarations, and community rules across Solah Parchi Thap.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-space-xs rounded-lg border border-outline px-space-md py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors self-start md:self-auto shrink-0"
        >
          <Icon name="arrow_back" size={18} />
          <span>Back to Baithak</span>
        </Link>
      </div>

      {/* Non-Gambling Notice Banner */}
      <div className="rounded-xl bg-surface-container-low border-l-4 border-primary p-space-lg mb-space-xl flex items-start gap-space-md">
        <Icon name="verified" size={28} className="text-primary shrink-0 mt-0.5" />
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Skill-Based Social Recreation Only (No Gambling)
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Solah Parchi Thap is 100% free to play. We do not accept deposits, charge entry fees for rooms, facilitate betting, or award monetary prizes. This platform exists solely to celebrate Indian traditional drawing-room nostalgia.
          </p>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-space-lg mb-space-xl">
        {TERMS_SECTIONS.map((sec) => (
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
                    {sec.highlight}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Related Policies & Business Contact */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/40 p-space-lg text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
          Related Governance &amp; Data Policies
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl mx-auto mb-space-md leading-relaxed">
          Learn how your personal information is protected under India&rsquo;s DPDP Act 2023 in our Privacy Policy, or review how local storage is configured in our Cookies Policy.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-space-md">
          <Link
            to="/privacy"
            className="rounded-lg bg-primary px-space-lg py-space-sm font-label-md text-label-md font-bold text-on-primary hover:bg-primary-container transition-colors shadow-sm"
          >
            Read Privacy Policy
          </Link>
          <Link
            to="/cookies"
            className="rounded-lg border border-outline px-space-lg py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cookies Policy
          </Link>
          <Link
            to="/rules"
            className="rounded-lg border border-outline px-space-lg py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Game Rules &amp; Lore
          </Link>
        </div>
      </div>
    </div>
  );
}
