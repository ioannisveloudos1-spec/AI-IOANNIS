/**
 * Universal Client-Side Web Fetcher with CORS Proxy Fallbacks
 * 
 * Works in Static SPA deployments (Netlify, Vercel, GitHub Pages),
 * Android APK WebViews, and Local Environments when backend /api is not reachable.
 */

interface FetchWebResult {
  success: boolean;
  html?: string;
  error?: string;
  source?: "backend" | "cors-proxy" | "direct";
}

const PUBLIC_CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

/**
 * Attempt to fetch a web page HTML.
 * Strategy:
 * 1. Try internal backend `/api/fetch-web-text` (if Express server is running)
 * 2. If running on Netlify / APK / static host without Express backend, fallback to public CORS proxies
 * 3. If everything fails, try direct fetch (useful for CORS-enabled APIs)
 */
export async function fetchWebPageUniversal(
  targetUrl: string,
  startPage: number = 1,
  pagesCount: number = 1
): Promise<{
  success: boolean;
  extractedText?: string;
  structuredItems?: Array<{ phrase: string; jewish?: number; english?: number; simple?: number }>;
  totalPagesDetected?: number;
  pagesFetched?: number;
  isGematrix?: boolean;
  error?: string;
}> {
  const isGematrix = /gematrix\.org/i.test(targetUrl);

  // 1. Try Backend First (if available in Dev / Node container)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    const backendRes = await fetch("/api/fetch-web-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: targetUrl,
        pagesCount,
        startPage,
      }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timer);

    if (backendRes && backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch {
    // Backend not running (Netlify static SPA / APK) - proceed to client-side proxies
  }

  // 2. Client-side fetch using CORS proxies
  const urlsToFetch: string[] = [];
  for (let p = startPage; p < startPage + pagesCount; p++) {
    try {
      const pUrl = new URL(targetUrl);
      if (p > 1 || pUrl.searchParams.has("page")) {
        pUrl.searchParams.set("page", String(p));
      }
      urlsToFetch.push(pUrl.toString());
    } catch {
      urlsToFetch.push(targetUrl);
    }
  }

  const allHtmls: string[] = [];
  let detectedPages = 1;

  for (const pageUrl of urlsToFetch) {
    let pageHtml: string | null = null;

    // Try direct fetch first
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(pageUrl, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        pageHtml = await res.text();
      }
    } catch {
      // Direct CORS blocked (expected on most browsers)
    }

    // Try CORS proxies sequentially
    if (!pageHtml) {
      for (const proxyFn of PUBLIC_CORS_PROXIES) {
        try {
          const proxiedUrl = proxyFn(pageUrl);
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), 9000);
          const res = await fetch(proxiedUrl, { signal: controller.signal });
          clearTimeout(t);
          if (res.ok) {
            const txt = await res.text();
            if (txt && txt.length > 200) {
              pageHtml = txt;
              break;
            }
          }
        } catch {
          // try next proxy
        }
      }
    }

    if (pageHtml) {
      allHtmls.push(pageHtml);
    }
  }

  if (allHtmls.length === 0) {
    return {
      success: false,
      error: "Δεν ήταν δυνατή η απευθείας ανάγνωση του URL (CORS / Δίκτυο). Σε στατικό περιβάλλον Netlify/APK, μπορείτε να αντιγράψετε και να επικολλήσετε το κείμενο ή τον πίνακα στην καρτέλα «Μαζικό Κείμενο (Paste)» για άμεση ανάλυση.",
    };
  }

  // Detect total pages in first page HTML
  const primaryHtml = allHtmls[0];
  const gematrixPagerMatch = primaryHtml.match(/href="[^"]*page=(\d+)"/g);
  if (gematrixPagerMatch) {
    const pNums = gematrixPagerMatch
      .map((m) => {
        const match = m.match(/page=(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
      })
      .filter((n) => !isNaN(n) && n > 0);
    if (pNums.length > 0) {
      detectedPages = Math.max(...pNums, 1);
    }
  }

  // Parse structured items (Gematrix.org)
  const structuredItems: Array<{ phrase: string; jewish?: number; english?: number; simple?: number }> = [];

  if (isGematrix) {
    const rowRegex = /<tr[^>]*>\s*<td[^>]*>\s*<a[^>]*href="[^"]*word=[^"]*"[^>]*>([\s\S]*?)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>/gi;

    for (const htmlContent of allHtmls) {
      let match;
      while ((match = rowRegex.exec(htmlContent)) !== null) {
        const rawPhrase = match[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .trim();
        if (rawPhrase) {
          structuredItems.push({
            phrase: rawPhrase,
            jewish: parseInt(match[2], 10),
            english: parseInt(match[3], 10),
            simple: parseInt(match[4], 10),
          });
        }
      }
    }
  }

  // Clean raw HTML text for general text extraction
  let combinedCleanedText = "";
  for (const htmlContent of allHtmls) {
    const cleaned = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    combinedCleanedText += " " + cleaned;
  }

  return {
    success: true,
    totalPagesDetected: detectedPages,
    pagesFetched: allHtmls.length,
    isGematrix,
    structuredItems,
    extractedText: combinedCleanedText.trim(),
  };
}
