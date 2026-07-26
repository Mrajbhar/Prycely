import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="price text-sm text-muted">404</p>
      <h1 className="display mt-2 text-3xl font-bold">This page doesn&apos;t exist</h1>
      <p className="mt-2 text-sm text-ink-soft">
        The link may be broken, or the page may have moved.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to shop</Button>
      </Link>
    </div>
  );
}