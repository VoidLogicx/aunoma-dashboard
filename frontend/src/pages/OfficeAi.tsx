import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { DocumentIcon, LightbulbIcon, ClipboardIcon, DownloadIcon, FileIcon } from "../components/Icons";
import { Layout, AppHeader, AppLogo, AppNav, ContentSection, PageHeader } from "../components/Layout";
import brain from "brain";
import { AuthGuard } from "../components/AuthGuard";
import { Toaster, toast } from "sonner";
import { Tooltip } from "../components/Tooltip";
import { handleNetworkError, validateField } from "../utils/errorHandling";
import { detectBrowser, getDeviceType, isBrowserSupported, simulateNetworkError } from "../utils/testUtils";

export default function OfficeAi() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("text");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  // For testing - browser and device detection
  const [browserInfo] = useState(detectBrowser());
  const [deviceType] = useState(getDeviceType());
  const [isTestMode, setIsTestMode] = useState(false);

  // Document type options
  const documentTypes = [
    { value: "text", label: "Dokument tekstowy" },
    { value: "presentation", label: "Prezentacja" },
    { value: "financial", label: "Raport finansowy" },
    { value: "offer", label: "Oferta handlowa" },
    { value: "email", label: "Email biznesowy" },
    { value: "contract", label: "Umowa" },
    { value: "report", label: "Raport analityczny" },
    { value: "newsletter", label: "Newsletter" },
    { value: "policy", label: "Polityka firmowa" },
    { value: "social", label: "Post w mediach społecznościowych" },
  ];

  // Template examples based on selected document type
  const templateSuggestions = {
    text: [
      "Raport z realizacji projektu marketingowego dla klienta X",
      "Podsumowanie sprzedaży za okres Q1 z rekomendacjami",
      "Analiza konkurencji w branży technologicznej"
    ],
    presentation: [
      "Prezentacja produktu X dla nowych klientów",
      "Strategia marketingowa na rok 2025",
      "Raport kwartalny dla zarządu"
    ],
    financial: [
      "Analiza rentowności produktu X w okresie 2023-2024",
      "Budżet działu marketingu na rok 2025",
      "Prognoza finansowa dla nowego produktu"
    ],
    offer: [
      "Oferta na wdrożenie systemu CRM dla klienta X",
      "Propozycja współpracy marketingowej dla firmy Y",
      "Oferta sprzedaży oprogramowania dla sektora finansowego"
    ],
    email: [
      "Email z podziękowaniem po spotkaniu z klientem",
      "Wiadomość z propozycją współpracy",
      "Email z prośbą o feedback po wdrożeniu"
    ],
    contract: [
      "Umowa o współpracy z podwykonawcą",
      "Umowa licencyjna na oprogramowanie",
      "Umowa dla klienta korzystającego z usług SaaS"
    ],
    report: [
      "Raport z analizy rynku w sektorze e-commerce",
      "Raport z efektywności kampanii marketingowej",
      "Raport okresowy z działalności firmy"
    ],
    newsletter: [
      "Newsletter miesięczny z aktualnościami branżowymi",
      "Newsletter dla klientów o nowych produktach",
      "Newsletter wewnętrzny dla pracowników"
    ],
    policy: [
      "Polityka bezpieczeństwa informacji w firmie",
      "Polityka ochrony danych osobowych",
      "Polityka HR dotycząca pracy zdalnej"
    ],
    social: [
      "Post o nowym produkcie na LinkedIn",
      "Ogłoszenie o wydarzeniu firmowym na Facebooku",
      "Kampania promocyjna na Instagramie"
    ]
  };

  // Fetch documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      // For testing - simulate network error if in test mode
      if (isTestMode) {
        try {
          await simulateNetworkError(0.7, 1000); // 70% chance of error
        } catch (error) {
          throw new Error('Błąd połączenia: Nie można połączyć się z serwerem');
        }
      }
      
      const response = await brain.list_documents();
      
      // Check for error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
      }
      
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      handleNetworkError(error, "Nie udało się załadować dokumentów.");
      setError("Nie udało się załadować dokumentów. Odśwież stronę, aby spróbować ponownie.");
    }
  };

  // Generate document
  const handleGenerateDocument = async () => {
    if (!documentType) {
      setError("Wybierz rodzaj dokumentu");
      return;
    }
    
    // Enhanced form validation
    const descriptionValidation = validateField(description, "opis dokumentu", true, 10, 1000);
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.message || "Proszę wypełnić wszystkie pola");
      return;
    }
    
    setIsGenerating(true);
    setError("");

    try {
      // For testing - simulate network error if in test mode
      if (isTestMode) {
        try {
          await simulateNetworkError(0.5, 2000); // 50% chance of error with longer delay
        } catch (error) {
          throw new Error('Błąd podczas generowania dokumentu: Przekroczono czas oczekiwania');
        }
      }
      
      const response = await brain.generate_document({
        document_type: documentType,
        description: description,
      });

      // Check for error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd serwera: ${response.status}`);
      }

      const data = await response.json();
      setCurrentDocument(data.document);
      loadDocuments(); // Refresh document list
      toast.success("Dokument został wygenerowany");
    } catch (error) {
      const errorMessage = handleNetworkError(error, "Wystąpił błąd podczas generowania dokumentu. Spróbuj ponownie.");
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Format date
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("pl-PL", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get document type display name
  const getDocumentTypeName = (type) => {
    const docType = documentTypes.find((dt) => dt.value === type);
    return docType ? docType.label : type;
  };

  const DocumentViewer = ({ document }) => {
    if (!document) return null;
    
    // Function to convert markdown to HTML
    const renderMarkdown = (text) => {
      if (!text) return "";
      
      // Basic markdown parsing for headers, bold text, and lists
      let formattedText = text
        // Headers
        .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
        .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
        .replace(/^### (.*)$/gm, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
        // Bold text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Lists
        .replace(/^- (.*)$/gm, '<li class="ml-6 list-disc">$1</li>')
        // Paragraphs
        .replace(/^([^<][^\n]+)$/gm, '<p class="mb-3">$1</p>');
      
      // Wrap lists properly
      formattedText = formattedText.replace(/(<li[^>]*>[\s\S]*?<\/li>)+/g, (match) => {
        return `<ul class="my-3">${match}</ul>`;
      });
      
      return formattedText;
    };
    
    // Function to handle document export
    const handleExport = (format) => {
      // In a real app, this would call an API endpoint to convert and download
      // For now, we'll simulate different export behaviors based on format
      if (format === "txt") {
        // For plain text, create a blob and download it
        const blob = new Blob([document.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${document.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Dokument wyeksportowany jako .txt");
      } else {
        // For PDF and DOCX, we would typically call an API endpoint
        // Here, we'll just show a notification that the feature would work in a real app
        toast.info(`Eksport do formatu ${format.toUpperCase()} będzie dostępny wkrótce`);
      }
    };
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-md mb-8 border border-gray-50 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <div>
            <h3 className="text-xl font-semibold text-aunoma-gray-dark">{document.title}</h3>
            <p className="text-sm text-aunoma-gray-dark">
              {getDocumentTypeName(document.document_type)} | Utworzono: {formatDate(document.created_at)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Tooltip content="Kopiuj zawartość dokumentu do schowka">
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(document.content);
                  toast.success("Skopiowano do schowka!");
                }}
                className="text-sm text-aunoma-red border-aunoma-gray-light hover:bg-aunoma-red-light/10 shadow-sm flex items-center"
                size="sm"
                aria-label="Kopiuj zawartość dokumentu"
              >
              <ClipboardIcon size={16} className="mr-1" /> Kopiuj
              </Button>
            </Tooltip>
            <Tooltip content="Zamknij widok dokumentu">
              <Button 
                variant="outline" 
                onClick={() => setCurrentDocument(null)}
                className="text-sm text-aunoma-gray-dark border-aunoma-gray-light hover:bg-aunoma-gray-light shadow-sm"
                size="sm"
                aria-label="Zamknij dokument"
              >
              Zamknij
              </Button>
            </Tooltip>
          </div>
        </div>
        
        {/* Document content with improved markdown rendering */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }} />
        
        {/* Document tools */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center mb-3">
            <LightbulbIcon size={18} className="text-aunoma-red mr-2" />
            <h4 className="font-medium text-aunoma-gray-dark">Narzędzia dokumentu</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-2 text-sm border-aunoma-gray-light hover:bg-aunoma-gray-light/30 text-aunoma-gray-dark justify-start"
              onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce")}
            >
              <span className="mr-2">📝</span> Edytuj
            </Button>
            
            {/* Export dropdown */}
            <div className="relative group" aria-label="Opcje eksportu dokumentu">
              <Button 
                variant="outline" 
                className="h-auto py-2 text-sm border-aunoma-gray-light hover:bg-aunoma-gray-light/30 text-aunoma-gray-dark justify-start w-full"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Eksportuj dokument do wybranego formatu"
              >
                <DownloadIcon size={18} className="mr-2" /> Eksportuj
              </Button>
              <div 
                className="absolute z-10 left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg invisible group-hover:visible"
                role="menu"
                aria-label="Dostępne formaty eksportu">
                {document.export_formats?.map((format) => (
                  <button
                    key={format}
                    className="w-full text-left px-4 py-2 text-sm text-aunoma-gray-dark hover:bg-aunoma-red-light/10 flex items-center focus:outline-none focus:bg-aunoma-red-light/10"
                    onClick={() => handleExport(format)}
                    role="menuitem"
                    aria-label={`Eksportuj jako ${format.toUpperCase()}`}
                  >
                    <FileIcon size={16} className="mr-2" />
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="h-auto py-2 text-sm border-aunoma-gray-light hover:bg-aunoma-gray-light/30 text-aunoma-gray-dark justify-start"
              onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce")}
            >
              <span className="mr-2">📄</span> Wersjonuj
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-2 text-sm border-aunoma-gray-light hover:bg-aunoma-gray-light/30 text-aunoma-gray-dark justify-start"
              onClick={() => toast.info("Ta funkcja będzie dostępna wkrótce")}
            >
              <span className="mr-2">🌐</span> Udostępnij
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
          icon={<DocumentIcon size={24} />}
          title="Office AI"
          description="Witaj w module Office AI. Twórz dokumenty łatwo i z pomocą sztucznej inteligencji."
        />

        {/* Testing Panel */}
        {isTestMode && (
          <ContentSection className="mb-6 border-blue-200 bg-blue-50">
            <div className="space-y-4">
              <h3 className="text-blue-700 font-medium">Panel testowy QA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-blue-700 text-sm font-medium mb-2">Informacje o środowisku</h4>
                  <div className="space-y-1 text-sm text-blue-600">
                    <p><strong>Przeglądarka:</strong> {browserInfo.name} {browserInfo.version}</p>
                    <p><strong>Typ urządzenia:</strong> {deviceType}</p>
                    <p><strong>Kompatybilność:</strong> {isBrowserSupported().supported ? 'Pełna' : 'Częściowa'}</p>
                    <p><strong>Rozdzielczość ekranu:</strong> {window.innerWidth}x{window.innerHeight}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-blue-700 text-sm font-medium mb-2">Testy funkcjonalne</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-blue-300 text-blue-700"
                      onClick={() => {
                        toast.error("Przykładowy błąd: Nie można wygenerować dokumentu");
                      }}
                    >
                      Test błędu generowania
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-blue-300 text-blue-700"
                      onClick={() => {
                        toast.success("Operacja zakończona sukcesem");
                      }}
                    >
                      Test sukcesu
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-blue-300 text-blue-700"
                      onClick={() => {
                        setError("To jest testowy komunikat błędu w formularzu");
                      }}
                    >
                      Symuluj błąd formularza
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-blue-300 text-blue-700"
                      onClick={() => {
                        setError("");
                      }}
                    >
                      Wyczyść błędy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>
        )}

        {/* Document Viewer */}
        {currentDocument && <DocumentViewer document={currentDocument} />}

        {/* Document Generator Form */}
        <ContentSection>
            <div className="flex items-center mb-6">
              <DocumentIcon className="text-aunoma-red mr-3" size={22} />
              <h3 className="text-xl font-semibold text-aunoma-gray-dark">Tworzenie dokumentów</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-aunoma-gray-dark mb-2">
                Wybierz rodzaj dokumentu
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:border-transparent bg-white shadow-sm text-aunoma-gray-dark transition-colors"
                value={documentType}
                onChange={(e) => {
                  setDocumentType(e.target.value);
                  // Reset description if template suggestions are visible
                  if (showTemplates) {
                    setShowTemplates(true);
                  }
                }}
                aria-label="Rodzaj dokumentu"
                id="document-type"
                aria-describedby="document-type-help"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-aunoma-gray-dark mb-2">
                  Opisz zawartość dokumentu
                </label>
                <button 
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-sm text-aunoma-red hover:text-aunoma-red-dark flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:ring-offset-1 rounded-md p-1"
                  aria-expanded={showTemplates ? "true" : "false"}
                  aria-controls="template-suggestions"
                  id="toggle-templates-button"
                >
                  <LightbulbIcon size={16} className="mr-1" />
                  {showTemplates ? "Ukryj przykłady" : "Pokaż przykłady"}
                </button>
              </div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:border-transparent bg-white shadow-sm text-aunoma-gray-dark resize-none transition-colors"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  // Clear error when user types
                  if (error) setError("");
                }}
                placeholder="Np. Stwórz ofertę dla klienta na usługi projektowania stron internetowych..."
                aria-label="Opis zawartości dokumentu"
                id="document-description"
                aria-describedby="description-help"
                aria-invalid={error ? "true" : "false"}
              />
              {error && <p className="text-red-500 text-sm mt-2" id="description-error" aria-live="assertive">{error}</p>}
              
              {/* Template suggestions */}
              {showTemplates && (
                <div className="mt-3 p-4 bg-aunoma-red-light/20 rounded-md border border-aunoma-red-light/30" aria-live="polite" id="template-suggestions" aria-label="Sugestie szablonów">
                  <div className="flex items-center mb-2">
                    <LightbulbIcon size={18} className="text-aunoma-red mr-2" />
                    <h4 className="font-medium text-aunoma-gray-dark">Przykłady dla typu: {documentTypes.find(dt => dt.value === documentType)?.label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {templateSuggestions[documentType]?.map((template, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setDescription(template);
                          setSelectedTemplate(template);
                          setShowTemplates(false);
                        }}
                        className="px-3 py-1.5 text-sm bg-white text-aunoma-gray-dark rounded border border-aunoma-red-light/30 hover:bg-aunoma-red-light/10 transition-colors focus:outline-none focus:ring-2 focus:ring-aunoma-red focus:ring-offset-1"
                        aria-label={`Użyj szablonu: ${template}`}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" aria-live="polite">
              <Button 
                variant="primary" 
                className="w-full md:w-auto px-6 bg-aunoma-red hover:bg-aunoma-red-dark shadow-sm h-12 font-medium transition-all"
                onClick={handleGenerateDocument}
                disabled={isGenerating}
                aria-busy={isGenerating ? "true" : "false"}
                aria-label="Generuj dokument"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin inline-block mr-3 h-4 w-4 border-t-2 border-white rounded-full"></span>
                    Generowanie...
                  </span>
                ) : "Generuj dokument"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full md:w-auto px-6 border-aunoma-gray-light text-aunoma-gray-dark hover:bg-aunoma-gray-light/50 shadow-sm h-12 font-medium transition-all flex items-center justify-center"
                onClick={() => {
                  setDescription("");
                  setError("");
                }}
                disabled={isGenerating || !description.trim()}
                aria-label="Wyczyść formularz"
              >
                Wyczyść
              </Button>
            </div>
        </ContentSection>

        {/* Documents List */}
        <ContentSection>
            <div className="flex items-center mb-6">
              <DocumentIcon className="text-aunoma-red mr-3" size={22} />
              <h3 className="text-xl font-semibold text-aunoma-gray-dark">Utworzone dokumenty</h3>
            </div>
            
            {documents.length === 0 ? (
              <p className="text-aunoma-gray-dark text-center py-6">Nie masz jeszcze żadnych dokumentów.</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="p-4 border border-gray-200 rounded-md hover:bg-aunoma-red-light/10 hover:border-aunoma-red/30 flex justify-between items-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-aunoma-red"
                    onClick={() => setCurrentDocument(doc)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Otwórz dokument: ${doc.title}, typ: ${getDocumentTypeName(doc.document_type)}, utworzony: ${formatDate(doc.created_at)}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentDocument(doc);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <DocumentIcon className="text-aunoma-red mr-3" size={20} />
                      <div>
                        <span className="font-semibold text-aunoma-gray-dark">{doc.title}</span>
                        <p className="text-sm text-aunoma-gray-dark mt-1">{getDocumentTypeName(doc.document_type)}</p>
                      </div>
                    </div>
                    <span className="text-sm text-aunoma-gray-dark bg-aunoma-gray-light px-3 py-1 rounded-full">{formatDate(doc.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
        </ContentSection>
      </main>

      </Layout>
    </AuthGuard>
  );
}