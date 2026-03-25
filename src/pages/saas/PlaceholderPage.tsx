import { EmptyState } from '@/components/saas/EmptyState';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <div>
    <h1 className="text-2xl font-bold font-subtitle text-slate-900 mb-6">{title}</h1>
    <EmptyState
      icon={Construction}
      title="In arrivo"
      description={description ?? `La sezione "${title}" è in fase di sviluppo.`}
    />
  </div>
);

export default PlaceholderPage;
