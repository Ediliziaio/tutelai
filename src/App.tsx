import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/saas/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Landing (eagerly loaded)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Lazy landing
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Servizi = lazy(() => import("./pages/Servizi"));
const Piattaforma = lazy(() => import("./pages/Piattaforma"));
const NormativaAI = lazy(() => import("./pages/NormativaAI"));
const PartnerProgram = lazy(() => import("./pages/PartnerProgram"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contatti = lazy(() => import("./pages/Contatti"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Termini = lazy(() => import("./pages/Termini"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Layouts
const AppLayout = lazy(() => import("./components/saas/AppLayout"));
const AdminLayout = lazy(() => import("./components/saas/AdminLayout"));

// Onboarding
const OnboardingWizard = lazy(() => import("./pages/saas/OnboardingWizard"));

// ── App Cliente ──
const AppDashboard = lazy(() => import("./pages/saas/AppDashboard"));
const AppRegistry = lazy(() => import("./pages/saas/AppRegistry"));
const AppRegistryNew = lazy(() => import("./pages/saas/AppRegistryNew"));
const AppRegistryDetail = lazy(() => import("./pages/saas/AppRegistryDetail"));
const AppDocs = lazy(() => import("./pages/saas/AppDocs"));
const AppDocsNew = lazy(() => import("./pages/saas/AppDocsNew"));
const AppDocsEdit = lazy(() => import("./pages/saas/AppDocsEdit"));
const AppMonitor = lazy(() => import("./pages/saas/AppMonitor"));
const AppMonitorDetail = lazy(() => import("./pages/saas/AppMonitorDetail"));
const AppMonitorSettings = lazy(() => import("./pages/saas/AppMonitorSettings"));
const AppTraining = lazy(() => import("./pages/saas/AppTraining"));
const AppTrainingTeam = lazy(() => import("./pages/saas/AppTrainingTeam"));
const AppTrainingPlay = lazy(() => import("./pages/saas/AppTrainingPlay"));
const AppTrainingQuiz = lazy(() => import("./pages/saas/AppTrainingQuiz"));
const AppTrainingCertificate = lazy(() => import("./pages/saas/AppTrainingCertificate"));
const AppGdpr = lazy(() => import("./pages/saas/AppGdpr"));
const AppGdprRegister = lazy(() => import("./pages/saas/AppGdprRegister"));
const AppGdprDpiaNew = lazy(() => import("./pages/saas/AppGdprDpiaNew"));
const AppGdprBreach = lazy(() => import("./pages/saas/AppGdprBreach"));
const AppAudit = lazy(() => import("./pages/saas/AppAudit"));
const AppAuditDetail = lazy(() => import("./pages/saas/AppAuditDetail"));
const AppSettingsCompany = lazy(() => import("./pages/saas/AppSettingsCompany"));
const AppSettingsTeam = lazy(() => import("./pages/saas/AppSettingsTeam"));
const AppSettingsSecurity = lazy(() => import("./pages/saas/AppSettingsSecurity"));
const AppSettingsNotifications = lazy(() => import("./pages/saas/AppSettingsNotifications"));
const AppSettingsIntegrations = lazy(() => import("./pages/saas/AppSettingsIntegrations"));
const AppBilling = lazy(() => import("./pages/saas/AppBilling"));
const AppBillingUpgrade = lazy(() => import("./pages/saas/AppBillingUpgrade"));
const AppNotifications = lazy(() => import("./pages/saas/AppNotifications"));
const AppCalendario = lazy(() => import("./pages/saas/AppCalendario"));
const AppGapAnalysis = lazy(() => import("./pages/saas/AppGapAnalysis"));
const AppAILawyer = lazy(() => import("./pages/saas/AppAILawyer"));
const AppFirmaDigitale = lazy(() => import("./pages/saas/AppFirmaDigitale"));
const AppReadinessReport = lazy(() => import("./pages/saas/AppReadinessReport"));
const AppExecutiveDashboard = lazy(() => import("./pages/saas/AppExecutiveDashboard"));
const AppVendorManagement = lazy(() => import("./pages/saas/AppVendorManagement"));
const AppReminders = lazy(() => import("./pages/saas/AppReminders"));

// ── SuperAdmin ──
const AdminDashboard = lazy(() => import("./pages/saas/AdminDashboard"));
const AdminAziende = lazy(() => import("./pages/saas/AdminAziende"));
const AdminAziendaDetail = lazy(() => import("./pages/saas/AdminAziendaDetail"));
const AdminUtenti = lazy(() => import("./pages/saas/AdminUtenti"));
const AdminPiani = lazy(() => import("./pages/saas/AdminPiani"));
const AdminContenuti = lazy(() => import("./pages/saas/AdminContenuti"));
const AdminCorsi = lazy(() => import("./pages/saas/AdminCorsi"));
const AdminReport = lazy(() => import("./pages/saas/AdminReport"));
const AdminImpostazioni = lazy(() => import("./pages/saas/AdminImpostazioni"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#FAFAF8]">
    <Loader2 className="h-8 w-8 animate-spin text-[#185FA5]" />
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
                {/* ── Landing ── */}
                <Route path="/" element={<Index />} />
                <Route path="/chi-siamo" element={<ChiSiamo />} />
                <Route path="/servizi" element={<Servizi />} />
                <Route path="/piattaforma" element={<Piattaforma />} />
                <Route path="/normativa-ai" element={<NormativaAI />} />
                <Route path="/partner" element={<PartnerProgram />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contatti" element={<Contatti />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/termini" element={<Termini />} />

                {/* ── Auth ── */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* ── Onboarding ── */}
                <Route path="/onboarding" element={<ProtectedRoute requiredArea="app"><OnboardingWizard /></ProtectedRoute>} />
                <Route path="/onboarding/:step" element={<ProtectedRoute requiredArea="app"><OnboardingWizard /></ProtectedRoute>} />

                {/* ── App Cliente ── */}
                <Route path="/app" element={<ProtectedRoute requiredArea="app"><AppLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<AppDashboard />} />

                  {/* AI Registry */}
                  <Route path="registry" element={<AppRegistry />} />
                  <Route path="registry/new" element={<AppRegistryNew />} />
                  <Route path="registry/:id" element={<AppRegistryDetail />} />

                  {/* Doc Generator */}
                  <Route path="docs" element={<AppDocs />} />
                  <Route path="docs/new" element={<AppDocsNew />} />
                  <Route path="docs/:id/edit" element={<AppDocsEdit />} />

                  {/* AI Monitor */}
                  <Route path="monitor" element={<AppMonitor />} />
                  <Route path="monitor/settings" element={<AppMonitorSettings />} />
                  <Route path="monitor/:id" element={<AppMonitorDetail />} />

                  {/* Training Hub */}
                  <Route path="training" element={<AppTraining />} />
                  <Route path="training/team" element={<AppTrainingTeam />} />
                  <Route path="training/courses/:id/play" element={<AppTrainingPlay />} />
                  <Route path="training/courses/:id/quiz" element={<AppTrainingQuiz />} />
                  <Route path="training/courses/:id/certificate" element={<AppTrainingCertificate />} />

                  {/* GDPR + AI */}
                  <Route path="gdpr" element={<AppGdpr />} />
                  <Route path="gdpr/register" element={<AppGdprRegister />} />
                  <Route path="gdpr/dpia/new" element={<AppGdprDpiaNew />} />
                  <Route path="gdpr/breach" element={<AppGdprBreach />} />

                  {/* Audit Trail */}
                  <Route path="audit" element={<AppAudit />} />
                  <Route path="audit/:id" element={<AppAuditDetail />} />

                  {/* Settings */}
                  <Route path="settings/company" element={<AppSettingsCompany />} />
                  <Route path="settings/team" element={<AppSettingsTeam />} />
                  <Route path="settings/security" element={<AppSettingsSecurity />} />
                  <Route path="settings/notifications" element={<AppSettingsNotifications />} />
                  <Route path="settings/integrations" element={<AppSettingsIntegrations />} />
                  <Route path="settings" element={<Navigate to="/app/settings/company" replace />} />

                  {/* Billing */}
                  <Route path="billing" element={<AppBilling />} />
                  <Route path="billing/upgrade" element={<AppBillingUpgrade />} />

                  {/* Notifications */}
                  <Route path="notifications" element={<AppNotifications />} />

                  {/* Calendario Scadenze */}
                  <Route path="calendario" element={<AppCalendario />} />

                  {/* Gap Analysis */}
                  <Route path="gap-analysis" element={<AppGapAnalysis />} />

                  {/* AI Legal Advisor */}
                  <Route path="ai-lawyer" element={<AppAILawyer />} />

                  {/* Firma Digitale */}
                  <Route path="firma" element={<AppFirmaDigitale />} />

                  {/* Readiness Report */}
                  <Route path="report" element={<AppReadinessReport />} />

                  {/* Executive Dashboard */}
                  <Route path="executive" element={<AppExecutiveDashboard />} />

                  {/* Vendor Management */}
                  <Route path="vendor" element={<AppVendorManagement />} />

                  {/* Reminder automatici */}
                  <Route path="reminders" element={<AppReminders />} />
                </Route>

                {/* ── SuperAdmin ── */}
                <Route path="/admin" element={<ProtectedRoute requiredArea="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="aziende" element={<AdminAziende />} />
                  <Route path="aziende/:id" element={<AdminAziendaDetail />} />
                  <Route path="utenti" element={<AdminUtenti />} />
                  <Route path="piani" element={<AdminPiani />} />
                  <Route path="contenuti" element={<AdminContenuti />} />
                  <Route path="corsi" element={<AdminCorsi />} />
                  <Route path="report" element={<AdminReport />} />
                  <Route path="impostazioni" element={<AdminImpostazioni />} />
                </Route>

                {/* ── 404 ── */}
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
