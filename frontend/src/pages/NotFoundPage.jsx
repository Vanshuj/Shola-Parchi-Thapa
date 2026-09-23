import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
export default function NotFoundPage() {
    return (<div className="max-w-md mx-auto px-space-md py-24 text-center">
      <p className="font-chalk text-6xl text-primary">404</p>
      <p className="mt-space-sm font-hand text-title-lg text-on-surface-variant">This parchi wasn&rsquo;t in the deck.</p>
      <Link to="/" className="mt-space-lg inline-block">
        <Button>Back home</Button>
      </Link>
    </div>);
}
