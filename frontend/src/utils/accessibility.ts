/**
 * Formats a date string in Polish format
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date
 */
export function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pl-PL", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  }).format(d);
}

/**
 * Adds delay for animations or other timed operations
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if an element is visible in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is visible
 */
export function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - The announcement priority ("assertive" or "polite")
 */
export function announceToScreenReader(message, priority = "polite") {
  // Create or find the announcement element
  let announcer = document.getElementById("screen-reader-announcer");
  
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "screen-reader-announcer";
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("aria-relevant", "additions text");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    document.body.appendChild(announcer);
  }
  
  // Update the announcer content
  announcer.textContent = "";
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}
