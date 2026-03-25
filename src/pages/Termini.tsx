import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Termini = () => (
  <>
    <Helmet>
      <title>Termini di Servizio — Impresa Leggera</title>
      <meta name="description" content="Termini e condizioni del servizio Impresa Leggera." />
    </Helmet>
    <Navbar onCtaClick={() => {}} />
    <main className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Termini di Servizio</h1>
      <p className="text-muted-foreground text-sm">
        Questa pagina è in fase di redazione. Saranno disponibili a breve i termini e le condizioni generali del servizio.
      </p>
    </main>
    <Footer />
  </>
);

export default Termini;
