import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUpIcon, 
  BarChartIcon, 
  UserIcon, 
  MessageCircleIcon,
  LightbulbIcon,
  ClipboardIcon
} from "../components/Icons";
import { Layout, AppHeader, AppLogo, AppNav, ContentSection, PageHeader } from "../components/Layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import brain from "brain";
import {
  SalesAnalyticsRequest,
  SalesAnalyticsResponse,
  CustomerInsightsResponse,
  FollowUpRequest,
  FollowUpResponse,
  CustomerSegment,
  FollowUpTemplate
} from "types";
import { AuthGuard } from "../components/AuthGuard";
import { handleNetworkError, validateField } from "../utils/errorHandling";
import { toast, Toaster } from "sonner";
import { Tooltip as CustomTooltip } from "../components/Tooltip";
import { detectBrowser, getDeviceType, isBrowserSupported, simulateNetworkError } from "../utils/testUtils";

// Custom formatter for numbers in charts
const numberFormatter = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
};

const COLORS = ["#D10A11", "#60a5fa", "#8b5cf6", "#10b981", "#f59e0b"];

export default function SalesAi() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"analytics" | "customers" | "followup">("analytics");
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState<SalesAnalyticsResponse | null>(null);
  
  // State for customer insights
  const [customerInsights, setCustomerInsights] = useState<CustomerInsightsResponse | null>(null);
  
  // State for follow-up generation
  const [followUpContext, setFollowUpContext] = useState("");
  const [followUpType, setFollowUpType] = useState("sales");
  const [followUpTemplates, setFollowUpTemplates] = useState<FollowUpTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FollowUpTemplate | null>(null);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  
  // State for new placeholder features
  const [showSalesPlanner, setShowSalesPlanner] = useState(false);
  const [salesGoal, setSalesGoal] = useState("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  // For testing - browser and device detection
  const [browserInfo] = useState(detectBrowser());
  const [deviceType] = useState(getDeviceType());
  const [isTestMode, setIsTestMode] = useState(false);

  // Fetch sales analytics data
  const fetchSalesAnalytics = async (selectedPeriod: string) => {
    setIsLoading(true);
    try {
      // For testing - simulate network error if in test mode
      if (isTestMode) {
        try {
          await simulateNetworkError(0.7, 1000); // 70% chance of error
        } catch (error) {
          throw new Error('Błąd połączenia: Nie można połączyć się z serwerem');
        }
      }
      
      const request: SalesAnalyticsRequest = { period: selectedPeriod };
      const response = await brain.get_sales_analytics(request);
      
      // Check for error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      handleNetworkError(error, "Nie udało się pobrać danych analitycznych. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customer insights
  const fetchCustomerInsights = async () => {
    setIsLoading(true);
    try {
      const response = await brain.get_customer_insights();
      
      // Check for error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomerInsights(data);
    } catch (error) {
      handleNetworkError(error, "Nie udało się pobrać danych o klientach. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate follow-up messages
  const generateFollowUp = async () => {
    // Validate the input
    const contextValidation = validateField(followUpContext, "kontekst spotkania", true, 10);
    if (!contextValidation.isValid) {
      toast.error(contextValidation.message);
      return;
    }
    
    setIsGeneratingTemplate(true);
    try {
      const request: FollowUpRequest = {
        context: followUpContext,
        type: followUpType
      };
      const response = await brain.generate_follow_up(request);
      
      // Check for error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
      }
      
      const data = await response.json();
      setFollowUpTemplates(data.templates);
      if (data.templates.length > 0) {
        setSelectedTemplate(data.templates[0]);
        toast.success("Wygenerowano szablony wiadomości");
      } else {
        toast.info("Nie wygenerowano żadnych szablonów. Spróbuj dodać więcej szczegółów.");
      }
    } catch (error) {
      handleNetworkError(error, "Nie udało się wygenerować wiadomości. Spróbuj ponownie.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchSalesAnalytics(period);
    } else if (activeTab === "customers") {
      fetchCustomerInsights();
    }
  }, [activeTab, period]);

  return (
    <AuthGuard>
      <Layout>
      <AppHeader>
        <div className="flex items-center">
          <AppLogo />
          <AppNav />
        </div>
        <div className="flex items-center gap-4">
          {isTestMode ? (
            <Button 
              variant="outline" 
              onClick={() => setIsTestMode(false)}
              className="font-medium border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
              size="sm"
            >
              Wyłącz tryb testowy
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsTestMode(true)}
              className="font-medium border-aunoma-gray-light hover:bg-aunoma-gray-light"
              size="sm"
            >
              Tryb QA
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="font-medium hidden md:inline-flex border-aunoma-gray-light hover:bg-aunoma-gray-light"
            size="sm"
          >
            Powrót do panelu
          </Button>
        </div>
      </AppHeader>

      <main className="container mx-auto px-4 sm:px-6 py-8 content-container max-w-7xl" id="main-content">
        <Toaster position="top-right" richColors closeButton toastOptions={{
          classNames: {
            toast: "rounded-md",
            title: "font-medium text-base",
            description: "text-sm text-gray-800"
          },
          duration: 5000,
        }} />
        <PageHeader 
          icon={<TrendingUpIcon size={24} />}
          title="Sales AI"
          description="Witaj w module Sales AI. Zwiększ produktywność sprzedaży z pomocą sztucznej inteligencji."
        >
          

        {/* Tabs for different features */}
        <div className="flex border-b border-gray-200 mb-4" role="tablist" aria-label="Funkcje Sales AI">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "analytics" ? "text-aunoma-red border-b-2 border-aunoma-red" : "text-aunoma-gray hover:text-aunoma-red transition-colors duration-200"}`}
            role="tab"
            id="tab-analytics"
            aria-selected={activeTab === "analytics"}
            aria-controls="panel-analytics"
            tabIndex={activeTab === "analytics" ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                setActiveTab("customers");
                document.getElementById("tab-customers")?.focus();
              }
            }}
          >
            <div className="flex items-center">
              <BarChartIcon className="mr-2" size={16} aria-hidden="true" /> Analiza sprzedaży
            </div>
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "customers" ? "text-aunoma-red border-b-2 border-aunoma-red" : "text-aunoma-gray hover:text-aunoma-red transition-colors duration-200"}`}
            role="tab"
            id="tab-customers"
            aria-selected={activeTab === "customers"}
            aria-controls="panel-customers"
            tabIndex={activeTab === "customers" ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setActiveTab("analytics");
                document.getElementById("tab-analytics")?.focus();
              } else if (e.key === "ArrowRight") {
                setActiveTab("followup");
                document.getElementById("tab-followup")?.focus();
              }
            }}
          >
            <div className="flex items-center">
              <UserIcon className="mr-2" size={16} aria-hidden="true" /> Analiza klientów
            </div>
          </button>
          <button
            onClick={() => setActiveTab("followup")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "followup" ? "text-aunoma-red border-b-2 border-aunoma-red" : "text-aunoma-gray hover:text-aunoma-red transition-colors duration-200"}`}
            role="tab"
            id="tab-followup"
            aria-selected={activeTab === "followup"}
            aria-controls="panel-followup"
            tabIndex={activeTab === "followup" ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setActiveTab("customers");
                document.getElementById("tab-customers")?.focus();
              } else if (e.key === "ArrowRight") {
                setShowSalesPlanner(true);
                document.getElementById("tab-planner")?.focus();
              }
            }}
          >
            <div className="flex items-center">
              <MessageCircleIcon className="mr-2" size={16} aria-hidden="true" /> Generator wiadomości
            </div>
          </button>
          <button
            onClick={() => setShowSalesPlanner(!showSalesPlanner)}
            className={`px-4 py-2 font-medium text-sm ${showSalesPlanner ? "text-aunoma-red border-b-2 border-aunoma-red" : "text-aunoma-gray hover:text-aunoma-red transition-colors duration-200"}`}
            role="tab"
            id="tab-planner"
            aria-selected={showSalesPlanner}
            aria-controls="panel-planner"
            tabIndex={showSalesPlanner ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setActiveTab("followup");
                document.getElementById("tab-followup")?.focus();
              }
            }}
          >
            <div className="flex items-center">
              <LightbulbIcon className="mr-2" size={16} aria-hidden="true" /> Planer sprzedaży
            </div>
          </button>
        </div>
        </PageHeader>

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div 
            className="space-y-6 max-w-4xl mx-auto"
            role="tabpanel"
            id="panel-analytics"
            aria-labelledby="tab-analytics"
            tabIndex={0}
          >
            <ContentSection>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <BarChartIcon className="text-aunoma-red mr-3" size={22} aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-aunoma-gray-dark">Analiza sprzedaży</h3>
                  </div>
                  <div className="flex items-center space-x-2" role="group" aria-label="Filtry okresu">
                    <button
                      onClick={() => {
                        setPeriod("monthly");
                        fetchSalesAnalytics("monthly");
                      }}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${period === "monthly" ? "bg-aunoma-red text-white shadow-sm" : "bg-aunoma-gray-light text-aunoma-gray-dark hover:bg-gray-200"}`}
                      aria-pressed={period === "monthly"}
                      aria-label="Pokaż dane miesięczne"
                    >
                      Miesięcznie
                    </button>
                    <button
                      onClick={() => {
                        setPeriod("quarterly");
                        fetchSalesAnalytics("quarterly");
                      }}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${period === "quarterly" ? "bg-aunoma-red text-white shadow-sm" : "bg-aunoma-gray-light text-aunoma-gray-dark hover:bg-gray-200"}`}
                      aria-pressed={period === "quarterly"}
                      aria-label="Pokaż dane kwartalne"
                    >
                      Kwartalnie
                    </button>
                    <button
                      onClick={() => {
                        setPeriod("yearly");
                        fetchSalesAnalytics("yearly");
                      }}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${period === "yearly" ? "bg-aunoma-red text-white shadow-sm" : "bg-aunoma-gray-light text-aunoma-gray-dark hover:bg-gray-200"}`}
                      aria-pressed={period === "yearly"}
                      aria-label="Pokaż dane roczne"
                    >
                      Rocznie
                    </button>
                  </div>
                </div>

              {isLoading ? (
                <div className="text-center py-12 text-aunoma-gray-dark" aria-live="polite" role="status">
                  <div 
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aunoma-red mx-auto mb-4" 
                    aria-hidden="true"
                  ></div>
                  <p>Ładowanie danych...</p>
                </div>
              ) : analyticsData ? (
                <div className="space-y-8 sm:space-y-10">
                  {/* Sales Trend Chart */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-aunoma-gray-dark">Trend sprzedaży</h4>
                    <div className="h-64 sm:h-72 lg:h-80 bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300" aria-label="Wykres trendu sprzedaży" role="img">
                      <div className="sr-only">
                        Wykres liniowy przedstawiający trend sprzedaży w czasie. 
                        {analyticsData.data.labels.map((label, index) => (
                          <div key={index}>
                            {label}: {analyticsData.data.salesData[index].toLocaleString()} PLN
                          </div>
                        ))}
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData.data.labels.map((label, index) => ({
                            name: label,
                            value: analyticsData.data.salesData[index]
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={numberFormatter} />
                          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} PLN`, "Sprzedaż"]} />
                          <Line type="monotone" dataKey="value" stroke="#D10A11" activeDot={{ r: 8 }} name="Sprzedaż" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sales By Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-aunoma-gray-dark">Sprzedaż wg kategorii</h4>
                      <div className="h-64 bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300" aria-label="Wykres kołowy sprzedaży według kategorii" role="img">
                        <div className="sr-only">
                          Wykres kołowy przedstawiający podział sprzedaży na kategorie. 
                          {analyticsData.data.categoryData.map((category) => (
                            <div key={category.name}>
                              {category.name}: {category.value.toLocaleString()} PLN
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.data.categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {analyticsData.data.categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} PLN`, "Sprzedaż"]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-aunoma-gray-dark">Konwersja (w %)</h4>
                      <div className="h-64 bg-white p-4 rounded-md border border-gray-100 shadow-sm" aria-label="Wykres słupkowy konwersji" role="img">
                        <div className="sr-only">
                          Wykres słupkowy przedstawiający procent konwersji w czasie. 
                          {analyticsData.data.labels.map((label, index) => (
                            <div key={index}>
                              {label}: {analyticsData.data.conversionData[index]}%
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analyticsData.data.labels.map((label, index) => ({
                              name: label,
                              value: analyticsData.data.conversionData[index]
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, "Konwersja"]} />
                            <Bar dataKey="value" fill="#D10A11" name="Konwersja" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                <div className="flex items-center mb-4">
                      <LightbulbIcon className="mr-2 text-aunoma-red" size={20} aria-hidden="true" />
                      <h4 className="text-lg font-semibold text-aunoma-gray-dark">Wnioski AI</h4>
                    </div>
                    <div className="bg-aunoma-red-light/20 p-5 sm:p-6 rounded-md space-y-5 border border-aunoma-red-light/40 shadow-sm hover:shadow-md transition-shadow duration-300" role="region" aria-label="Wnioski i rekomendacje AI">
                      <div>
                        <h5 className="text-md font-semibold mb-3 text-aunoma-gray-dark">Kluczowe wnioski:</h5>
                        <ul className="list-disc pl-6 space-y-2">
                          {analyticsData.insights.map((insight, index) => (
                            <li key={index} className="text-aunoma-gray">{insight}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-md font-medium mb-2 text-aunoma-gray-dark">Rekomendacje:</h5>
                        <ul className="list-disc pl-6 space-y-2">
                          {analyticsData.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-aunoma-gray">{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-aunoma-gray-dark space-y-4">
                  <p>Wybierz okres, aby wyświetlić analizę sprzedaży</p>
                  <div className="flex justify-center space-x-3 mt-2">
                    <Button
                      onClick={() => {
                        setPeriod("monthly");
                        fetchSalesAnalytics("monthly");
                      }}
                      variant="primary"
                      size="sm"
                      className="bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm"
                    >
                      Miesięcznie
                    </Button>
                    <Button
                      onClick={() => {
                        setPeriod("quarterly");
                        fetchSalesAnalytics("quarterly");
                      }}
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                    >
                      Kwartalnie
                    </Button>
                    <Button
                      onClick={() => {
                        setPeriod("yearly");
                        fetchSalesAnalytics("yearly");
                      }}
                      variant="outline"
                      size="sm"
                      className="shadow-sm"
                    >
                      Rocznie
                    </Button>
                  </div>
                </div>
              )}
            </ContentSection>
          </div>
        )}

        {/* Customer Insights Tab */}
        {activeTab === "customers" && (
          <div 
            className="space-y-6"
            role="tabpanel"
            id="panel-customers"
            aria-labelledby="tab-customers"
            tabIndex={0}
          >
            <ContentSection>
                <div className="flex items-center mb-6">
                  <UserIcon className="text-aunoma-red mr-3" size={22} aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-aunoma-gray-dark">Analiza klientów</h3>
                </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64" aria-live="polite" role="status">
                  <div 
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aunoma-red" 
                    aria-hidden="true"
                  ></div>
                  <p className="ml-4 text-aunoma-gray-dark">Ładowanie danych...</p>
                </div>
              ) : customerInsights ? (
                <div className="space-y-8">
                  {/* Customer Segments */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-aunoma-gray-dark">Segmenty klientów</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-100 shadow-sm rounded-md overflow-hidden hover:shadow-md transition-shadow duration-300" aria-label="Segmenty klientów">
                        <thead className="bg-aunoma-gray-light">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Segment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Liczba</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Śr. wartość zamówienia</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Częstotliwość zakupów</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Opis</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {customerInsights.segments.map((segment) => (
                            <tr key={segment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-aunoma-red">{segment.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{segment.size}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{segment.avg_order_value.toLocaleString()} PLN</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{segment.purchase_frequency}/rok</td>
                              <td className="px-6 py-4 text-sm text-aunoma-gray-dark leading-relaxed">{segment.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Opportunities */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-aunoma-gray-dark">Najlepsze szanse sprzedażowe</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-100 shadow-sm rounded-md overflow-hidden" aria-label="Najlepsze szanse sprzedażowe">
                        <thead className="bg-aunoma-gray-light">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Firma</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Potencjał</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Prawdopodobieństwo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Segment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-aunoma-gray-dark uppercase tracking-wider">Następny krok</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {customerInsights.top_opportunities.map((opportunity: any, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-aunoma-red">{opportunity.company}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{opportunity.potential.toLocaleString()} PLN</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{(opportunity.probability * 100).toFixed(0)}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{opportunity.segment}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-aunoma-gray-dark">{opportunity.nextStep}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div>
                    <div className="flex items-center mb-4">
                      <LightbulbIcon className="mr-3 text-aunoma-red" size={22} aria-hidden="true" />
                      <h4 className="text-lg font-semibold text-aunoma-gray-dark">Rekomendacje AI</h4>
                    </div>
                    <div className="bg-aunoma-red-light/20 p-5 rounded-md border border-aunoma-red-light/40 shadow-sm hover:shadow-md transition-shadow duration-300" role="region" aria-label="Rekomendacje AI dla klientów">
                      <ul className="list-disc pl-6 space-y-2">
                        {customerInsights.ai_recommendations.map((recommendation, index) => (
                          <li key={index} className="text-aunoma-gray">{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-aunoma-gray-dark space-y-4">
                  <p>Kliknij przycisk poniżej, aby załadować analizę klientów</p>
                  <Button variant="primary" className="mt-2 shadow-sm" onClick={fetchCustomerInsights}>
                    Analizuj klientów
                  </Button>
                </div>
              )}
            </ContentSection>
          </div>
        )}

        {/* Follow-up Generator Tab */}
        {activeTab === "followup" && (
          <div 
            className="space-y-6"
            role="tabpanel"
            id="panel-followup"
            aria-labelledby="tab-followup"
            tabIndex={0}
          >
            <ContentSection>
              <div className="flex items-center mb-6">
                <MessageCircleIcon className="text-aunoma-red mr-3" size={22} />
                <h3 className="text-xl font-semibold text-aunoma-gray-dark">Generator wiadomości follow-up</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-aunoma-gray-dark mb-1" htmlFor="context-input">Kontekst spotkania lub rozmowy</label>
                  <textarea
                    id="context-input"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-aunoma-blue focus:border-aunoma-blue bg-white text-aunoma-gray-dark resize-none transition-colors"
                    rows={4}
                    placeholder="Opisz kontekst spotkania lub rozmowy, dla której chcesz wygenerować wiadomość follow-up"
                    value={followUpContext}
                    onChange={(e) => setFollowUpContext(e.target.value)}
                    aria-describedby="context-hint"
                    aria-required="true"
                    aria-invalid={followUpContext.trim().length < 10 ? "true" : "false"}
                  />
                  <div id="context-hint" className="text-xs text-aunoma-gray mt-1" aria-live="polite">Dodaj szczegóły dotyczące spotkania dla lepszych rezultatów (min. 10 znaków)</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-aunoma-gray-dark mb-1" htmlFor="message-type">Typ wiadomości</label>
                  <select
                    id="message-type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-aunoma-blue focus:border-aunoma-blue bg-white text-aunoma-gray-dark transition-colors"
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    aria-describedby="message-type-hint"
                  >
                    <option value="sales">Sprzedażowa</option>
                    <option value="marketing">Marketingowa</option>
                    <option value="support">Obsługa klienta</option>
                  </select>
                  <div id="message-type-hint" className="text-xs text-aunoma-gray mt-1 sr-only">Wybierz rodzaj wiadomości, którą chcesz wygenerować</div>
                </div>
                
                <div>
                  <Button 
                    variant="primary" 
                    onClick={generateFollowUp}
                    className="w-full h-12 font-medium bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-aunoma-red focus:ring-offset-2"
                    disabled={isGeneratingTemplate || !followUpContext.trim() || followUpContext.trim().length < 10}
                    aria-live="polite"
                    aria-busy={isGeneratingTemplate}
                  >
                    {isGeneratingTemplate ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" aria-hidden="true"></span>
                        <span>Generowanie...</span>
                      </span>
                    ) : (
                      "Generuj wiadomości follow-up"
                    )}
                  </Button>
                </div>
                
                {followUpTemplates.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-medium mb-4 text-aunoma-gray-dark">Wygenerowane szablony</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {followUpTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className={`p-4 border rounded-md cursor-pointer transition-all duration-300 ${selectedTemplate?.id === template.id ? 'border-aunoma-red bg-aunoma-red-light/20 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'}`}
                          onClick={() => setSelectedTemplate(template)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedTemplate(template);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={selectedTemplate?.id === template.id}
                          aria-label={`Wybierz szablon: ${template.name}`}
                        >
                          <h5 className="font-semibold text-aunoma-gray-dark mb-2">{template.name}</h5>
                          <p className="text-aunoma-gray text-sm truncate leading-relaxed">{template.content.substring(0, 60)}...</p>
                        </div>
                      ))}
                    </div>
                    
                    {selectedTemplate && (
                      <div className="bg-white p-6 rounded-md border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h5 className="font-semibold text-aunoma-gray-dark mb-4 text-lg">{selectedTemplate.name}</h5>
                        <div className="prose max-w-none">
                          {selectedTemplate.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 text-aunoma-gray leading-relaxed">{line}</p>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                          <Button
                            variant="primary"
                            className="bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm transition-all focus:ring-2 focus:ring-aunoma-red focus:ring-offset-2"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedTemplate.content);
                              toast.success("Skopiowano do schowka!");
                            }}
                            aria-label="Kopiuj treść wiadomości do schowka"
                          >
                            <ClipboardIcon className="mr-2" size={16} aria-hidden="true" /> Kopiuj do schowka
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ContentSection>
          </div>
        )}
        
        {/* Sales Planner (placeholder feature) */}
        {showSalesPlanner && (
          <div 
            className="space-y-6 max-w-4xl mx-auto"
            role="tabpanel"
            id="panel-planner"
            aria-labelledby="tab-planner"
            tabIndex={0}
          >
            <ContentSection>
              <div className="flex items-center mb-6">
                <LightbulbIcon className="text-aunoma-red mr-3" size={22} />
                <h3 className="text-xl font-semibold text-aunoma-gray-dark">Planer sprzedaży AI</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-aunoma-red-light/10 border border-aunoma-red-light/30 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <LightbulbIcon size={20} className="text-aunoma-red" />
                    <h4 className="font-medium text-aunoma-gray-dark">Inteligentny planer sprzedaży</h4>
                  </div>
                  <p className="text-aunoma-gray-dark text-sm mb-3">Opisz swój cel sprzedażowy, aby otrzymać spersonalizowany plan działań z konkretnymi krokami i strategiami.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-aunoma-gray-dark">Twój cel sprzedażowy</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:border-transparent bg-white shadow-sm text-aunoma-gray-dark resize-none transition-colors"
                    rows={4}
                    value={salesGoal}
                    onChange={(e) => setSalesGoal(e.target.value)}
                    placeholder="Np. Zwiększenie sprzedaży usług konsultingowych o 20% w ciągu następnych 3 miesięcy..."
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    className="px-6 w-full sm:w-auto bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm transition-all"
                    onClick={() => {
                      if (!salesGoal.trim()) return;
                      setIsGeneratingPlan(true);
                      // Simulate API call
                      setTimeout(() => {
                        setIsGeneratingPlan(false);
                        toast.info("Ta funkcja będzie dostępna wkrótce!");
                      }, 1500);
                    }}
                    disabled={isGeneratingPlan || !salesGoal.trim()}
                  >
                    {isGeneratingPlan ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin inline-block mr-3 h-4 w-4 border-t-2 border-white rounded-full"></span>
                        Generowanie planu...
                      </span>
                    ) : "Generuj plan sprzedaży"}
                  </Button>
                </div>
                
                <div className="pt-8 pb-4 border-t border-gray-100 mt-8">
                  <h4 className="font-semibold text-aunoma-gray-dark mb-4">Przykładowe funkcje planera sprzedaży (wkrótce):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">🎯</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Targetowanie klientów</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Identyfikacja najlepszych segmentów klientów dla Twojego celu</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">📊</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Prognozy sprzedaży</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Szczegółowe prognozy oparte na danych historycznych</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">📝</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Plan krokowy</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Tygodniowy plan działań z konkretnymi zadaniami</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">💬</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Skrypty sprzedażowe</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Spersonalizowane skrypty dla różnych segmentów</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">🔄</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Optymalizacja procesu</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Sugestie usprawnień w procesie sprzedażowym</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-aunoma-red">📱</span>
                        <h5 className="font-medium text-aunoma-gray-dark">Integracja z CRM</h5>
                      </div>
                      <p className="text-sm text-aunoma-gray">Automatyczne dodawanie zadań do systemu CRM</p>
                    </div>
                  </div>
                </div>
                
                {/* QA Testing Information */}
                {isTestMode && (
                  <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
                    <h4 className="text-blue-700 font-medium mb-2">Informacje diagnostyczne</h4>
                    <div className="space-y-2 text-sm text-blue-600">
                      <p><strong>Przeglądarka:</strong> {browserInfo.name} {browserInfo.version}</p>
                      <p><strong>Typ urządzenia:</strong> {deviceType}</p>
                      <p><strong>Kompatybilność:</strong> {isBrowserSupported().message}</p>
                      <p><strong>Rozdzielczość ekranu:</strong> {window.innerWidth}x{window.innerHeight}</p>
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast.error("To jest testowy komunikat błędu dla QA");
                          }}
                        >
                          Testuj powiadomienia o błędach
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ContentSection>
          </div>
        )}
      </main>

      </Layout>
    </AuthGuard>
  );
}