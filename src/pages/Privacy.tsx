import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => (
  <>
        <SEOHead
      title="Privacy Policy — TutelAI"
      description="Informativa sulla privacy di TutelAI."
      canonical="https://tutelai.it/privacy"
    />
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
