import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/saas/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Landing pages (eagerly loaded — critical path)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Lazy-loaded landing pages
const ServicePage = lazy(() => import("./pages/ServicePage"));
const PerChiPage = lazy(() => import("./pages/PerChiPage"));
const PerChi = lazy(() => import("./pages/PerChi"));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Garanzia = lazy(() => import("./pages/Garanzia"));
const ComeFunziona = lazy(() => import("./pages/ComeFunziona"));
const Tariffe = lazy(() => import("./pages/Tariffe"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Termini = lazy(() => import("./pages/Termini"));

// Auth pages
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Layouts
const AppLayout = lazy(() => import("./components/saas/AppLayout"));
const AdminLayout = lazy(() => import("./components/saas/AdminLayout"));

// SaaS pages (lazy-loaded)
const PlaceholderPage = lazy(() => import("./pages/saas/PlaceholderPage"));
const AdminDashboard = lazy(() => import("./pages/saas/AdminDashboard"));
const AdminClienti = lazy(() => import("./pages/saas/AdminClienti"));
const AdminFatturazione = lazy(() => import("./pages/saas/AdminFatturazione"));
const AdminPratiche = lazy(() => import("./pages/saas/AdminPratiche"));
const AdminReport = lazy(() => import("./pages/saas/AdminReport"));
const AdminImpostazioni = lazy(() => import("./pages/saas/AdminImpostazioni"));
const EditorFattura = lazy(() => import("./pages/saas/EditorFattura"));
const NuovoClienteWizard = lazy(() => import("./pages/saas/NuovoClienteWizard"));
const ClienteDettaglio = lazy(() => import("./pages/saas/ClienteDettaglio"));
const PraticaDettaglio = lazy(() => import("./pages/saas/PraticaDettaglio"));
const AppDashboard = lazy(() => import("./pages/saas/AppDashboard"));
const AppFatture = lazy(() => import("./pages/saas/AppFatture"));
const AppFatturaDettaglio = lazy(() => import("./pages/saas/AppFatturaDettaglio"));
const AppPratiche = lazy(() => import("./pages/saas/AppPratiche"));
const AppImpostazioni = lazy(() => import("./pages/saas/AppImpostazioni"));
const AppDocumenti = lazy(() => import("./pages/saas/AppDocumenti"));
const NuovaPraticaCliente = lazy(() => import("./pages/saas/NuovaPraticaCliente"));
const OnboardingWizard = lazy(() => import("./pages/saas/OnboardingWizard"));
const AppCrediti = lazy(() => import("./pages/saas/AppCrediti"));
const CassettoFiscale = lazy(() => import("./pages/saas/CassettoFiscale"));
const Scadenzario = lazy(() => import("./pages/saas/Scadenzario"));
const FatturePassive = lazy(() => import("./pages/saas/FatturePassive"));
const ImpostazioniFatturazione = lazy(() => import("./pages/saas/ImpostazioniFatturazione"));
const AdminOperatori = lazy(() => import("./pages/saas/AdminOperatori"));
const NotifichePage = lazy(() => import("./pages/saas/NotifichePage"));

// Redirects (tiny, can be eager)
import { AppRedirect, AdminRedirect } from "./pages/saas/Redirects";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ===== Landing (pubbliche) ===== */}
                <Route path="/" element={<Index />} />
                <Route path="/servizi/:slug" element={<ServicePage />} />
                <Route path="/per-chi" element={<PerChi />} />
                <Route path="/per-chi/:slug" element={<PerChiPage />} />
                <Route path="/chi-siamo" element={<ChiSiamo />} />
                <Route path="/garanzia" element={<Garanzia />} />
                <Route path="/come-funziona" element={<ComeFunziona />} />
                <Route path="/tariffe" element={<Tariffe />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/termini" element={<Termini />} />

                {/* ===== Auth (pubbliche) ===== */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* ===== App Cliente (protette) ===== */}
                <Route path="/app" element={<ProtectedRoute requiredArea="app"><AppLayout /></ProtectedRoute>}>
                  <Route index element={<AppRedirect />} />
                  <Route path="dashboard" element={<AppDashboard />} />
                  <Route path="pratiche" element={<AppPratiche />} />
                  <Route path="pratiche/nuova" element={<NuovaPraticaCliente />} />
                  <Route path="pratiche/:id" element={<PraticaDettaglio isAdmin={false} />} />
                  <Route path="fatture" element={<AppFatture />} />
                  <Route path="fatture/:id" element={<AppFatturaDettaglio />} />
                  <Route path="fatture-ricevute" element={<FatturePassive />} />
                  <Route path="scadenzario" element={<Scadenzario />} />
                  <Route path="cassetto-fiscale" element={<CassettoFiscale readOnly />} />
                  <Route path="documenti" element={<AppDocumenti />} />
                  <Route path="crediti" element={<AppCrediti />} />
                  <Route path="notifiche" element={<NotifichePage area="app" />} />
                  <Route path="impostazioni" element={<AppImpostazioni />} />
                </Route>

                {/* ===== Admin SuperAdmin (protette) ===== */}
                <Route path="/admin" element={<ProtectedRoute requiredArea="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminRedirect />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="clienti" element={<AdminClienti />} />
                  <Route path="clienti/nuovo" element={<NuovoClienteWizard />} />
                  <Route path="clienti/:id" element={<ClienteDettaglio />} />
                  <Route path="pratiche" element={<AdminPratiche />} />
                  <Route path="pratiche/:id" element={<PraticaDettaglio isAdmin={true} />} />
                  <Route path="fatturazione" element={<AdminFatturazione />} />
                  <Route path="fatturazione/nuova" element={<EditorFattura />} />
                  <Route path="fatturazione/:id/modifica" element={<EditorFattura />} />
                  <Route path="scadenzario" element={<Scadenzario />} />
                  <Route path="fatture-passive" element={<FatturePassive />} />
                  <Route path="cassetto-fiscale" element={<CassettoFiscale />} />
                  <Route path="operatori" element={<AdminOperatori />} />
                  <Route path="notifiche" element={<NotifichePage area="admin" />} />
                  <Route path="report" element={<AdminReport />} />
                  <Route path="impostazioni" element={<AdminImpostazioni />} />
                  <Route path="impostazioni-fatturazione" element={<ImpostazioniFatturazione />} />
                </Route>

                {/* ===== Onboarding (protetta) ===== */}
                <Route path="/onboarding" element={<ProtectedRoute requiredArea="app"><OnboardingWizard /></ProtectedRoute>} />

                {/* ===== 404 ===== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
