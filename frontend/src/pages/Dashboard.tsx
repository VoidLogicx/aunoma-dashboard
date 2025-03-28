import React, { useState } from "react";
import { useAuthStore } from "../utils/store";
import { logout } from "../utils/auth";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { AiModuleCard } from "../components/AiModuleCard";
import { Modal } from "../components/Modal";
import { Tooltip } from "../components/Tooltip";
import { TransitionEffect } from "../components/Animations";
import { DocumentIcon, UsersIcon, FactoryIcon, TrendingUpIcon, TruckIcon, UtensilsIcon } from "../components/Icons";
import { Layout, AppHeader, AppLogo, AppNav, ContentSection, PageHeader } from "../components/Layout";
import { AuthGuard } from "../components/AuthGuard";
import { toast, Toaster } from "../components/AccessibleToast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactiveModuleInfo, setInactiveModuleInfo] = useState<{ title: string; description: string } | null>(null);

  console.log("Dashboard rendered with user:", user); // Debug log

  // AI Module data in Polish
  const aiModules = [
    {
      title: "Office AI",
      description: "Twórz dokumenty łatwo i z pomocą AI",
      isActive: true,
      icon: <DocumentIcon className="text-aunoma-blue" size={20} />,
      path: "/office-ai"
    },
    {
      title: "Client AI",
      description: "Popraw zadowolenie klientów",
      isActive: false,
      icon: <UsersIcon className="text-gray-600" size={20} />,
      path: "/client-ai"
    },
    {
      title: "Production AI",
      description: "Zwiększ wydajność dzięki automatyzacji",
      isActive: false,
      icon: <FactoryIcon className="text-gray-600" size={20} />,
      path: "/production-ai"
    },
    {
      title: "Sales AI",
      description: "Zwiększ produktywność sprzedaży",
      isActive: true,
      icon: <TrendingUpIcon className="text-aunoma-blue" size={20} />,
      path: "/sales-ai"
    },
    {
      title: "Logistic AI",
      description: "Usprawnij dostawy dzięki automatyzacji operacji",
      isActive: false,
      icon: <TruckIcon className="text-gray-600" size={20} />,
      path: "/logistic-ai"
    },
    {
      title: "Catering AI",
      description: "Zwiększ przychody gastronomiczne z AI",
      isActive: false,
      icon: <UtensilsIcon className="text-gray-600" size={20} />,
      path: "/catering-ai"
    }
  ];

  const handleLogout = async () => {
    console.log("Logout clicked"); // Debug log
    try {
      await logout();
      clearAuth();
      toast.success("Wylogowano pomyślnie", { duration: 2000 });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Błąd podczas wylogowywania", { duration: 3000 });
    }
  };
  
  // Add explicit check for user
  if (!user) {
    console.log("Dashboard: No user found, redirecting to login"); // Debug log
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
    return (
      <div className="min-h-screen flex items-center justify-center bg-aunoma-bg">
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-aunoma-red border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-aunoma-gray-dark">Przekierowywanie do strony logowania...</p>
        </div>
      </div>
    );
  }

  const handleModuleClick = (path: string, isActive: boolean, moduleInfo?: { title: string, description: string }) => {
    if (isActive) {
      toast.info(`Przechodzenie do ${moduleInfo?.title || 'modułu'}`, { duration: 1500 });
      navigate(path);
    } else if (moduleInfo) {
      // Show modal with information about inactive module
      setInactiveModuleInfo(moduleInfo);
      setShowInactiveModal(true);
      toast.warning(`Moduł ${moduleInfo.title} nie jest jeszcze aktywny`, { duration: 3000 });
    }
  };

  return (
    <AuthGuard>
      <Layout>
      <Toaster />
      <AppHeader>
        <div className="flex items-center">
          <AppLogo />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <AppNav />
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <span className="text-aunoma-gray-dark bg-gray-100 px-3 py-1 rounded-md text-sm hidden sm:inline-flex">
              {user?.email}
            </span>
            <Tooltip content="Wyloguj się z aplikacji">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="font-medium"
                size="sm"
                aria-label="Wyloguj się"
              >
                Wyloguj się
              </Button>
            </Tooltip>
          </div>
        </div>
      </AppHeader>

      <main className="container mx-auto px-4 sm:px-6 py-8 content-container max-w-7xl" id="main-content" role="main">
        {/* Welcome Section */}
        <TransitionEffect type="fade" duration={400}>
          <ContentSection className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-aunoma-blue/10 p-2.5 rounded-md mr-3 shadow-sm">
                <div className="text-aunoma-blue" aria-hidden="true"><DocumentIcon size={24} /></div>
              </div>
              <h1 className="text-2xl font-bold text-aunoma-gray-dark">Witaj w Aunoma AI</h1>
            </div>
            <p className="text-aunoma-gray-dark max-w-3xl leading-relaxed">
              Panel kontrolny umożliwia dostęp do wszystkich modułów AI. 
              Obecnie aktywne są moduły <span className="font-medium text-aunoma-blue">Office AI</span> oraz 
              <span className="font-medium text-aunoma-blue"> Sales AI</span>.
            </p>
          </ContentSection>
        </TransitionEffect>

        {/* AI Modules Grid */}
        <TransitionEffect type="slide-up" delay={200} duration={400}>
          <section className="mb-12" aria-labelledby="modules-heading">
            <div className="flex items-center mb-6">
              <div className="bg-aunoma-blue/10 p-2.5 rounded-md mr-3 shadow-sm">
                <div className="text-aunoma-blue" aria-hidden="true"><DocumentIcon size={22} /></div>
              </div>
              <h2 id="modules-heading" className="text-xl font-bold text-aunoma-gray-dark">Moduły Aunoma AI</h2>
            </div>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              role="list"
              aria-label="Lista modułów AI"
            >
              {aiModules.map((module, index) => (
                <div 
                  key={index} 
                  onClick={() => handleModuleClick(module.path, module.isActive, {
                    title: module.title,
                    description: module.description
                  })}
                  className={`${module.isActive ? 'cursor-pointer' : 'cursor-pointer'} relative`}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleModuleClick(module.path, module.isActive, {
                        title: module.title,
                        description: module.description
                      });
                    }
                  }}
                  aria-label={`${module.title}: ${module.description}${module.isActive ? '' : ' (niedostępny)'}`}
                >
                  <AiModuleCard 
                    title={module.title}
                    description={module.description}
                    isActive={module.isActive}
                    icon={module.icon}
                  />
                  {!module.isActive && (
                    <div 
                      className="absolute top-3 right-3 bg-aunoma-red/80 text-white text-xs px-2.5 py-1 rounded-full shadow-sm"
                      aria-hidden="true"
                    >
                      Wkrótce
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </TransitionEffect>

        {/* Quick Access Section */}
        <TransitionEffect type="slide-up" delay={300} duration={400}>
          <section className="mb-8" aria-labelledby="quick-access-heading">
            <div className="flex items-center mb-6">
              <div className="bg-aunoma-blue/10 p-2.5 rounded-md mr-3 shadow-sm">
                <div className="text-aunoma-blue" aria-hidden="true"><TrendingUpIcon size={22} /></div>
              </div>
              <h2 id="quick-access-heading" className="text-xl font-bold text-aunoma-gray-dark">Szybki dostęp</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-50 hover:border-aunoma-red/40 transition-all hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <DocumentIcon className="text-aunoma-red mr-3" size={24} aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-aunoma-gray-dark">Office AI</h3>
                </div>
                <p className="text-aunoma-gray-dark mb-4 leading-relaxed">Szybki dostęp do tworzenia dokumentów z pomocą AI</p>
                <Tooltip content="Przejdź do modułu Office AI">
                  <Button 
                    variant="primary" 
                    className="w-full justify-center bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm h-12 font-medium" 
                    onClick={() => {
                      toast.info("Przechodzenie do Office AI", { duration: 1500 });
                      navigate("/office-ai");
                    }}
                    aria-label="Otwórz moduł Office AI"
                  >
                    Otwórz Office AI
                  </Button>
                </Tooltip>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-50 hover:border-aunoma-red/40 transition-all hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <TrendingUpIcon className="text-aunoma-red mr-3" size={24} aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-aunoma-gray-dark">Sales AI</h3>
                </div>
                <p className="text-aunoma-gray-dark mb-4 leading-relaxed">Szybki dostęp do narzędzi zwiększających sprzedaż</p>
                <Tooltip content="Przejdź do modułu Sales AI">
                  <Button 
                    variant="primary" 
                    className="w-full justify-center bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm h-12 font-medium" 
                    onClick={() => {
                      toast.info("Przechodzenie do Sales AI", { duration: 1500 });
                      navigate("/sales-ai");
                    }}
                    aria-label="Otwórz moduł Sales AI"
                  >
                    Otwórz Sales AI
                  </Button>
                </Tooltip>
              </div>
            </div>
          </section>
        </TransitionEffect>
      </main>

      {/* Modal for inactive modules */}
      <Modal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        title={inactiveModuleInfo?.title || "Moduł niedostępny"}
        aria-labelledby="inactive-module-title"
        aria-describedby="inactive-module-description"
      >
        <div className="space-y-5">
          <p className="text-aunoma-gray-dark leading-relaxed">
            Funkcjonalność <span className="font-semibold">{inactiveModuleInfo?.title}</span> będzie dostępna w przyszłej aktualizacji.
          </p>
          
          <div className="p-5 bg-aunoma-red-light/20 rounded-md border border-aunoma-red-light/30 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="text-aunoma-red mr-2 bg-aunoma-red/10 p-1.5 rounded-full">
                <DocumentIcon size={18} />
              </div>
              <h4 className="font-semibold text-aunoma-red">Co będzie oferować {inactiveModuleInfo?.title}?</h4>
            </div>
            <p className="text-sm text-aunoma-gray-dark">{inactiveModuleInfo?.description}</p>
          </div>

          <div className="p-5 bg-amber-50 rounded-md border border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="text-amber-700 mr-2 bg-amber-100/50 p-1.5 rounded-full">
                <TrendingUpIcon size={18} />
              </div>
              <h4 className="font-semibold text-amber-700">Informacja</h4>
            </div>
            <p className="text-sm text-aunoma-gray-dark">
              Obecnie dostępne są moduły <span className="font-medium text-aunoma-red">Office AI</span> oraz <span className="font-medium text-aunoma-red">Sales AI</span>. 
              Pozostałe funkcje będą stopniowo dodawane w kolejnych aktualizacjach.
            </p>
          </div>

          <div className="text-right pt-2">
            <Button 
              variant="primary"
              onClick={() => setShowInactiveModal(false)}
              className="bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm h-11 px-6 font-medium transition-all"
            >
              Rozumiem
            </Button>
          </div>
        </div>
      </Modal>
      </Layout>
    </AuthGuard>
  );
}