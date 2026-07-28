import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => (
  <>
    <Helmet>
      <title>Privacy Policy — TutelAI</title>
      <meta name="description" content="Informativa sulla privacy di TutelAI." />
      <link rel="canonical" href="https://tutelai.it/privacy" />
    </Helmet>
    <Navbar onCtaClick={() => {}} />
    <main className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm">
        Questa pagina è in fase di redazione. Sarà disponibile a breve l'informativa completa sul trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679).
      </p>
    </main>
    <Footer />
  </>
);

export default Privacy;
