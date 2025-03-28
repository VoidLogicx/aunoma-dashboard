/**
 * Testing utilities for cross-browser compatibility and responsive design
 */

// Screen sizes for testing responsive design
export const screenSizes = {
  mobile: { width: 375, height: 667 },  // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  laptop: { width: 1366, height: 768 }, // Common laptop
  desktop: { width: 1920, height: 1080 }, // Full HD
  widescreen: { width: 2560, height: 1440 } // 2K
};

// Supported browsers for testing
export const supportedBrowsers = [
  { name: 'Chrome', minVersion: '88', notes: 'Pełne wsparcie' },
  { name: 'Firefox', minVersion: '85', notes: 'Pełne wsparcie' },
  { name: 'Safari', minVersion: '14', notes: 'Pełne wsparcie' },
  { name: 'Edge', minVersion: '88', notes: 'Pełne wsparcie' },
  { name: 'Opera', minVersion: '74', notes: 'Niewielkie różnice w stylach' }
];

/**
 * Detect browser type and version
 */
export function detectBrowser(): { name: string; version: string } {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";
  
  // Detect Chrome
  if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
    browserName = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Firefox
  else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Safari
  else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    browserName = "Safari";
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Edge
  else if (userAgent.indexOf("Edg") > -1) {
    browserName = "Edge";
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Opera
  else if (userAgent.indexOf("OPR") > -1) {
    browserName = "Opera";
    const match = userAgent.match(/OPR\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }
  
  return { name: browserName, version: browserVersion };
}

/**
 * Check if current browser is supported
 */
export function isBrowserSupported(): { supported: boolean; message: string } {
  const { name, version } = detectBrowser();
  const browser = supportedBrowsers.find(b => b.name === name);
  
  if (!browser) {
    return { 
      supported: false, 
      message: `Przeglądarka ${name} nie jest oficjalnie wspierana. Użyj Chrome, Firefox, Safari lub Edge dla najlepszych doświadczeń.` 
    };
  }
  
  const currentVersion = parseFloat(version);
  const minVersion = parseFloat(browser.minVersion);
  
  if (isNaN(currentVersion) || currentVersion < minVersion) {
    return { 
      supported: false, 
      message: `Twoja wersja przeglądarki ${name} (${version}) może nie być w pełni kompatybilna. Zalecamy aktualizację do wersji ${browser.minVersion} lub nowszej.` 
    };
  }
  
  return { 
    supported: true, 
    message: `Przeglądarka ${name} (${version}) jest w pełni wspierana.` 
  };
}

/**
 * Get current device type based on screen size
 */
export function getDeviceType(): string {
  const width = window.innerWidth;
  
  if (width < 640) return "mobile";
  if (width < 768) return "tablet-small";
  if (width < 1024) return "tablet";
  if (width < 1280) return "laptop";
  if (width < 1536) return "desktop";
  return "widescreen";
}

/**
 * Test if a feature is supported in current browser
 */
export function isFeatureSupported(feature: string): boolean {
  const features = {
    flexbox: window.CSS?.supports?.('display', 'flex') ?? true,
    grid: window.CSS?.supports?.('display', 'grid') ?? true,
    css_variables: window.CSS?.supports?.('--test', '0') ?? true,
    localstorage: !!window.localStorage,
    sessionstorage: !!window.sessionStorage,
    clipboard: !!navigator.clipboard,
    fetch: !!window.fetch,
    async_await: true, // Supported in all modern browsers
    intl: !!window.Intl
  } as Record<string, boolean>;
  
  return features[feature] ?? false;
}

/**
 * Simulate network errors for testing error handling
 * @param probability - Chance of error (0-1)
 * @param delay - Delay in ms before error
 */
export function simulateNetworkError(probability = 0.5, delay = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (Math.random() < probability) {
      setTimeout(() => {
        reject(new Error('Symulowany błąd połączenia'));
      }, delay);
    } else {
      resolve();
    }
  });
}

/**
 * Test client-side validation with various inputs
 * @param validationFn - The validation function to test
 * @param testCases - Array of test cases
 */
export function testValidation<T>(validationFn: (input: T) => boolean, testCases: {input: T, expected: boolean}[]): {
  passed: boolean;
  results: {input: T, expected: boolean, actual: boolean, passed: boolean}[];
} {
  const results = testCases.map(test => {
    const actual = validationFn(test.input);
    return {
      ...test,
      actual,
      passed: actual === test.expected
    };
  });
  
  return {
    passed: results.every(r => r.passed),
    results
  };
}
