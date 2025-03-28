import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { detectBrowser, getDeviceType, isBrowserSupported, simulateNetworkError, isFeatureSupported } from "utils/testUtils";
import brain from "brain";

const TestingPage: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<{ name: string; version: string }>({ name: "", version: "" });
  const [supportInfo, setSupportInfo] = useState<{ supported: boolean; message: string }>({ supported: false, message: "" });
  const [deviceType, setDeviceType] = useState("");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [featureSupport, setFeatureSupport] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("test@aunoma.ai");
  const [testText, setTestText] = useState("Przykładowy tekst do testów");
  const [networkTestResult, setNetworkTestResult] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  useEffect(() => {
    // Get browser information
    const browser = detectBrowser();
    setBrowserInfo(browser);
    
    // Check browser support
    const support = isBrowserSupported();
    setSupportInfo(support);
    
    // Get device type
    setDeviceType(getDeviceType());
    
    // Get viewport size
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Check feature support
    setFeatureSupport({
      flexbox: isFeatureSupported("flexbox"),
      grid: isFeatureSupported("grid"),
      cssVariables: isFeatureSupported("css_variables"),
      localStorage: isFeatureSupported("localstorage"),
      sessionStorage: isFeatureSupported("sessionstorage"),
      clipboard: isFeatureSupported("clipboard"),
      fetch: isFeatureSupported("fetch"),
      intl: isFeatureSupported("intl")
    });
    
    // Listen for window resize
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setDeviceType(getDeviceType());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const runSimulatedNetworkTest = async () => {
    setNetworkTestResult(null);
    setLoading(true);
    
    try {
      await simulateNetworkError(0.7, 2000); // 70% chance of error, 2s delay
      setNetworkTestResult("✅ Połączenie udane");
      toast.success("Test połączenia zakończony sukcesem");
    } catch (error) {
      setNetworkTestResult(`❌ Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`); 
      toast.error(`Błąd połączenia: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runApiTest = async () => {
    setApiTestResult(null);
    setLoading(true);
    
    try {
      // Test the API
      const healthCheck = await brain.check_health();
      const jsonResponse = await healthCheck.json();
      
      setApiTestResult(`✅ API działa. Status: ${healthCheck.status}, Odpowiedź: ${JSON.stringify(jsonResponse)}`);
      toast.success("Test API zakończony sukcesem");
    } catch (error) {
      setApiTestResult(`❌ Błąd API: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
      toast.error(`Błąd API: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const testEmailValidation = () => {
    if (validateEmail(testEmail)) {
      toast.success("Adres email jest prawidłowy");
    } else {
      toast.error("Adres email jest nieprawidłowy");
    }
  };
  
  const testTextValidation = () => {
    if (testText.length < 5) {
      toast.error("Tekst jest za krótki (minimum 5 znaków)");
    } else if (testText.length > 100) {
      toast.error("Tekst jest za długi (maksimum 100 znaków)");
    } else {
      toast.success("Tekst ma prawidłową długość");
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Strona Testowa</h1>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Wersja: 1.0.0-QA</span>
      </div>
      
      <Tabs defaultValue="browser">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="browser">Zgodność przeglądarki</TabsTrigger>
          <TabsTrigger value="responsive">Responsywność</TabsTrigger>
          <TabsTrigger value="validation">Walidacja formularzy</TabsTrigger>
          <TabsTrigger value="api">Testy API</TabsTrigger>
          <TabsTrigger value="issues">Raportowanie</TabsTrigger>
          <TabsTrigger value="docs">Dokumentacja</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browser" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informacje o przeglądarce</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">Przeglądarka</h3>
                <p><strong>Nazwa:</strong> {browserInfo.name}</p>
                <p><strong>Wersja:</strong> {browserInfo.version}</p>
                <p className={`mt-2 ${supportInfo.supported ? 'text-green-600' : 'text-red-600'}`}>
                  <strong>Status:</strong> {supportInfo.message}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Urządzenie</h3>
                <p><strong>Typ:</strong> {deviceType}</p>
                <p><strong>Szerokość okna:</strong> {viewport.width}px</p>
                <p><strong>Wysokość okna:</strong> {viewport.height}px</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Wsparcie dla funkcji</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(featureSupport).map(([feature, supported]) => (
                  <div key={feature} className={`p-2 rounded ${supported ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p><strong>{feature}:</strong> {supported ? '✓' : '✗'}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dokumentacja testowa</h2>
            
            <div className="prose max-w-none">
              <h3>Środowisko testowe</h3>
              <p>Aplikacja posiada dedykowaną stronę testową dostępną pod adresem <code>/testing-page</code>, która umożliwia przeprowadzenie testów:</p>
              <ul>
                <li>Kompatybilności przeglądarek</li>
                <li>Responsywności</li>
                <li>Walidacji formularzy</li>
                <li>Połączeń API</li>
                <li>Raportowania błędów</li>
              </ul>
              
              <h3>Wspierane przeglądarki</h3>
              <div className="overflow-x-auto">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className="border p-2">Przeglądarka</th>
                      <th className="border p-2">Minimalna wersja</th>
                      <th className="border p-2">Status wsparcia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Chrome</td>
                      <td className="border p-2">88</td>
                      <td className="border p-2">Pełne wsparcie</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Firefox</td>
                      <td className="border p-2">85</td>
                      <td className="border p-2">Pełne wsparcie</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Safari</td>
                      <td className="border p-2">14</td>
                      <td className="border p-2">Pełne wsparcie</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Edge</td>
                      <td className="border p-2">88</td>
                      <td className="border p-2">Pełne wsparcie</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Opera</td>
                      <td className="border p-2">74</td>
                      <td className="border p-2">Niewielkie różnice w stylach</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3>Testy do przeprowadzenia</h3>
              
              <h4>1. Testy logowania</h4>
              <ul>
                <li>Logowanie z poprawnymi danymi (admin@aunoma.ai / admin123)</li>
                <li>Obsługa niepoprawnych danych logowania</li>
                <li>Obsługa pustych pól</li>
                <li>Walidacja formatu email</li>
                <li>Weryfikacja komunikatów błędów</li>
                <li>Weryfikacja przekierowania po zalogowaniu</li>
              </ul>
              
              <h4>2. Testy Office AI</h4>
              <ul>
                <li>Generowanie dokumentów z różnymi parametrami</li>
                <li>Sprawdzenie poprawności formatu wygenerowanych dokumentów</li>
                <li>Weryfikacja obsługi błędów API przy generowaniu dokumentów</li>
                <li>Sprawdzenie listy dokumentów i jej aktualizacji</li>
                <li>Test sortowania i filtrowania dokumentów</li>
              </ul>
              
              <h4>3. Testy Sales AI</h4>
              <ul>
                <li>Sprawdzenie analityki sprzedaży dla różnych okresów</li>
                <li>Weryfikacja wyświetlania wykresów i danych</li>
                <li>Test funkcji insightów klienta</li>
                <li>Sprawdzenie generowania follow-up'ów</li>
                <li>Weryfikacja obsługi błędów API dla wszystkich funkcji</li>
              </ul>
              
              <h4>4. Testy responsywności</h4>
              <p>Sprawdzenie aplikacji na następujących szerokościach ekranu:</p>
              <ul>
                <li>Desktop (1920px+) - Pełny widok</li>
                <li>Laptop (1366px-1919px) - Zoptymalizowany układ</li>
                <li>Tablet (768px-1365px) - Dopasowany układ</li>
                <li>Mobile - NIE TESTOWAĆ (aplikacja jest zoptymalizowana dla desktop)</li>
              </ul>
              
              <h4>5. Testy obsługi błędów</h4>
              <ul>
                <li>Utrata połączenia z internetem</li>
                <li>Timeout odpowiedzi serwera</li>
                <li>Błąd 500 serwera</li>
                <li>Niedostępność API</li>
              </ul>
              
              <h3>Procesy QA</h3>
              
              <h4>Schematy testowe</h4>
              <ol>
                <li><strong>Testowanie funkcjonalne</strong> - weryfikacja czy wszystkie funkcje działają zgodnie z wymaganiami</li>
                <li><strong>Testowanie UI</strong> - sprawdzenie wizualnych aspektów interfejsu użytkownika</li>
                <li><strong>Testowanie integracji</strong> - weryfikacja komunikacji między front-end a back-end</li>
                <li><strong>Testowanie obsługi błędów</strong> - sprawdzenie jak aplikacja reaguje na różne scenariusze błędów</li>
              </ol>
              
              <h4>Raportowanie błędów</h4>
              <p>Wszystkie znalezione błędy powinny być raportowane z użyciem formularza na stronie testowej z następującymi informacjami:</p>
              <ul>
                <li>Tytuł problemu</li>
                <li>Kategoria</li>
                <li>Priorytet</li>
                <li>Szczegółowy opis problemu z krokami reprodukcji</li>
                <li>Środowisko (przeglądarka, rozdzielczość)</li>
              </ul>
              
              <h3>Dane dostępowe</h3>
              <p><strong>Login testowy:</strong><br />
              Email: admin@aunoma.ai<br />
              Hasło: admin123</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Raportowanie błędów i problemów</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Formularz zgłoszenia problemu</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tytuł problemu</label>
                  <Input 
                    placeholder="Krótki opis problemu"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Kategoria</label>
                  <select className="w-full p-2 border rounded">
                    <option value="ui">Interfejs użytkownika</option>
                    <option value="performance">Wydajność</option>
                    <option value="functionality">Funkcjonalność</option>
                    <option value="api">API</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priorytet</label>
                  <select className="w-full p-2 border rounded">
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                    <option value="critical">Krytyczny</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Szczegółowy opis</label>
                  <textarea 
                    className="w-full p-2 border rounded min-h-[150px]"
                    placeholder="Szczegółowy opis problemu z krokami reprodukcji"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Środowisko</label>
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    <p><strong>Przeglądarka:</strong> {browserInfo.name} {browserInfo.version}</p>
                    <p><strong>Typ urządzenia:</strong> {deviceType}</p>
                    <p><strong>Rozdzielczość:</strong> {viewport.width}x{viewport.height}px</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("Zgłoszenie zostało zapisane. W rzeczywistej aplikacji zostałoby wysłane do bazy błędów.")}>
                    Zapisz zgłoszenie
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-2">Lista kontrolna jakości</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="check1" className="mr-2" />
                  <label htmlFor="check1">Wszystkie strony ładują się poprawnie</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check2" className="mr-2" />
                  <label htmlFor="check2">Formularze działają i walidują dane</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check3" className="mr-2" />
                  <label htmlFor="check3">Aplikacja jest responsywna na wszystkich rozmiarach ekranu</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check4" className="mr-2" />
                  <label htmlFor="check4">Błędy sieciowe są odpowiednio obsługiwane i komunikowane</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check5" className="mr-2" />
                  <label htmlFor="check5">API zwraca odpowiednie komunikaty o błędach</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check6" className="mr-2" />
                  <label htmlFor="check6">Wszystkie elementy UI są dostępne z klawiatury</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check7" className="mr-2" />
                  <label htmlFor="check7">Dane logowania działają prawidłowo</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check8" className="mr-2" />
                  <label htmlFor="check8">Wszystkie ikony i obrazy ładują się poprawnie</label>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsive" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Responsywności</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Aktualne wymiary okna</h3>
              <p className="text-lg">{viewport.width} × {viewport.height} px</p>
              <p className="mt-1">Typ urządzenia: <strong>{deviceType}</strong></p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Test elementów</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-blue-100 p-4 rounded shadow text-center">
                    Element {i}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="bg-purple-100 p-4 rounded shadow flex-1">
                  Element flex 1
                </div>
                <div className="bg-purple-100 p-4 rounded shadow flex-1">
                  Element flex 2
                </div>
              </div>
              
              <div className="overflow-auto mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Kolumna 1</th>
                      <th className="border p-2">Kolumna 2</th>
                      <th className="border p-2">Kolumna 3</th>
                      <th className="border p-2">Kolumna 4</th>
                      <th className="border p-2">Kolumna 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Dane 1</td>
                      <td className="border p-2">Dane 2</td>
                      <td className="border p-2">Dane 3</td>
                      <td className="border p-2">Dane 4</td>
                      <td className="border p-2">Dane 5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Zmień rozmiar okna przeglądarki, aby sprawdzić zachowanie responsywności.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="validation" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Walidacji Formularzy</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Walidacja adresu email</h3>
              <div className="flex gap-2 mb-2">
                <Input 
                  type="email" 
                  value={testEmail} 
                  onChange={(e) => setTestEmail(e.target.value)} 
                  placeholder="Wpisz adres email"
                />
                <Button onClick={testEmailValidation}>Sprawdź</Button>
              </div>
              <p className="text-sm text-gray-600">Wpisz prawidłowy lub nieprawidłowy adres email i kliknij Sprawdź</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Walidacja długości tekstu</h3>
              <div className="flex gap-2 mb-2">
                <Input 
                  type="text" 
                  value={testText} 
                  onChange={(e) => setTestText(e.target.value)} 
                  placeholder="Wpisz tekst (5-100 znaków)"
                />
                <Button onClick={testTextValidation}>Sprawdź</Button>
              </div>
              <p className="text-sm text-gray-600">Długość tekstu: {testText.length} znaków (wymagane 5-100)</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Testy API i Sieci</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Symulacja błędu sieci</h3>
              <Button 
                onClick={runSimulatedNetworkTest} 
                disabled={loading}
                className="mb-2"
              >
                {loading ? "Testowanie..." : "Uruchom test sieci"}
              </Button>
              {networkTestResult && (
                <p className={networkTestResult.includes("✅") ? "text-green-600" : "text-red-600"}>
                  {networkTestResult}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Test symuluje 70% szansy na błąd sieci. Uruchom kilka razy, aby zobaczyć oba przypadki.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Test API</h3>
              <Button 
                onClick={runApiTest} 
                disabled={loading}
                className="mb-2"
              >
                {loading ? "Testowanie..." : "Sprawdź status API"}
              </Button>
              {apiTestResult && (
                <p className={apiTestResult.includes("✅") ? "text-green-600" : "text-red-600"}>
                  {apiTestResult}
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingPage;
