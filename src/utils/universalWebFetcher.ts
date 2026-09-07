/**
 * Universal Client-Side & Hybrid Web Fetcher with Multi-Strategy CORS Proxies & APK Support
 * Works seamlessly in Android APK WebViews (Capacitor/Cordova/TWA/file:///), Static SPA deployments (Netlify, Vercel, GitHub Pages), and Local Express server.
 */

import { ENGLISH_BASE6_CORPUS, GREEK_IONIAN_CORPUS } from "../data/isopsephyCorpus";

export interface StructuredScrapeItem {
  phrase: string;
  english?: number;
  simple?: number;
}

export interface UniversalFetchResult {
  success: boolean;
  extractedText?: string;
  structuredItems?: StructuredScrapeItem[];
  totalPagesDetected?: number;
  pagesFetched?: number;
  isGematrix?: boolean;
  engineUsed?: string;
  error?: string;
}

/**
 * Detects if the app is running inside an APK / Android WebView / Capacitor / Cordova / file:/// environment
 */
export function isApkOrMobileWebView(): boolean {
  if (typeof window === "undefined") return false;
  const isFileProto = window.location.protocol === "file:";
  const isLocalhostScheme = window.location.hostname === "localhost" && !window.location.port;
  const isCapacitor = !!(window as any).Capacitor;
  const isCordova = !!(window as any).cordova;
  const isAndroidWv = /Android.*(wv|\.0\.0\.0)/i.test(navigator.userAgent);
  return isFileProto || isLocalhostScheme || isCapacitor || isCordova || isAndroidWv;
}

/**
 * Parses Markdown tables or structured text from Jina AI Reader or plain text sources
 */
export function extractStructuredGematriaFromMarkdown(markdown: string): StructuredScrapeItem[] {
  const items: StructuredScrapeItem[] = [];
  const seen = new Set<string>();

  // Parse markdown tables: | Phrase | Jewish | English | Simple | OR | Phrase | Value |
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    if (!line.includes("|")) continue;
    const cols = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (cols.length >= 2) {
      const phrase = cols[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
      if (
        phrase.length >= 2 &&
        !/^(word|phrase|gematria|jewish|english|simple|search|results|---|:---)/i.test(phrase)
      ) {
        const upper = phrase.toUpperCase();
        if (!seen.has(upper)) {
          seen.add(upper);
          const nums = cols
            .slice(1)
            .map((c) => parseInt(c.replace(/[^\d]/g, ""), 10))
            .filter((n) => !isNaN(n));

          items.push({
            phrase,
            english: nums[1] !== undefined ? nums[1] : nums[0],
            simple: nums[2],
          });
        }
      }
    }
  }

  // Also parse markdown links: [Phrase](...word=...)
  const linkRegex = /\[([^\]]+)\]\([^)]*(?:word|query)=[^)]*\)/gi;
  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const rawPhrase = match[1].trim();
    if (rawPhrase.length >= 2) {
      const upper = rawPhrase.toUpperCase();
      if (!seen.has(upper)) {
        seen.add(upper);
        items.push({ phrase: rawPhrase });
      }
    }
  }

  return items;
}

/**
 * Parses any HTML content (Gematrix tables, links, articles, lists) to extract phrases and numerical scores.
 */
export function extractStructuredGematriaFromHtml(html: string, targetUrl: string): {
  structuredItems: StructuredScrapeItem[];
  totalPages: number;
  cleanedText: string;
} {
  const structuredItems: StructuredScrapeItem[] = [];
  const seenPhrases = new Set<string>();
  let totalPages = 1;

  // 1. Detect total pages from pagination links
  const pageMatch = html.match(/href="[^"]*page=(\d+)"/gi) || html.match(/[?&]page=(\d+)/gi);
  if (pageMatch) {
    const pageNums = pageMatch
      .map((m) => {
        const numMatch = m.match(/page=(\d+)/i);
        return numMatch ? parseInt(numMatch[1], 10) : 1;
      })
      .filter((n) => !isNaN(n) && n > 0);
    if (pageNums.length > 0) {
      totalPages = Math.max(...pageNums, 1);
    }
  }

  // 2. Table Row Parsing (Universal for Gematrix, table-based databases)
  const trMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const tr of trMatches) {
    const tdMatches = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (tdMatches && tdMatches.length >= 2) {
      const cellTexts = tdMatches.map((td) =>
        td
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      );

      const rawPhrase = cellTexts[0];
      if (
        rawPhrase &&
        rawPhrase.length >= 2 &&
        !/^(word|phrase|gematria|jewish|english|simple|search|results)/i.test(rawPhrase)
      ) {
        const upper = rawPhrase.toUpperCase();
        if (!seenPhrases.has(upper)) {
          seenPhrases.add(upper);
          const nums = cellTexts
            .slice(1)
            .map((c) => parseInt(c.replace(/[^\d]/g, ""), 10))
            .filter((n) => !isNaN(n));

          structuredItems.push({
            phrase: rawPhrase,
            english: nums[1] !== undefined ? nums[1] : nums[0],
            simple: nums[2],
          });
        }
      }
    }
  }

  // 3. Fallback: Parse Gematrix word links `<a href="...word=...">Phrase</a>`
  const wordLinkRegex = /<a[^>]*href="[^"]*(?:word|query)=([^"&>]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let linkMatch;
  while ((linkMatch = wordLinkRegex.exec(html)) !== null) {
    const rawPhrase = linkMatch[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, " ")
      .trim();

    if (rawPhrase && rawPhrase.length >= 2) {
      const upper = rawPhrase.toUpperCase();
      if (!seenPhrases.has(upper)) {
        seenPhrases.add(upper);
        structuredItems.push({
          phrase: rawPhrase,
        });
      }
    }
  }

  // 4. Extract cleaned text for general tokenizer
  const cleanedText = html
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

  return {
    structuredItems,
    totalPages,
    cleanedText,
  };
}

/**
 * Fetches a single page using a tiered APK & Web multi-proxy strategy
 */
async function fetchSinglePageResilient(
  pageUrl: string
): Promise<{ text: string; isMarkdown: boolean; engine: string } | null> {
  // Strategy 0: Capacitor / Cordova Native HTTP (Bypasses CORS completely in APK!)
  try {
    const capacitorObj = (window as any).Capacitor;
    if (capacitorObj && capacitorObj.Plugins && capacitorObj.Plugins.CapacitorHttp) {
      const resp = await capacitorObj.Plugins.CapacitorHttp.get({
        url: pageUrl,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          Accept: "text/html,application/xhtml+xml,text/plain",
        },
      });
      if (resp && resp.data) {
        const text = typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
        if (text.length > 100) {
          return { text, isMarkdown: false, engine: "Capacitor Native HTTP (APK Direct)" };
        }
      }
    }
  } catch {
    // continue to next strategies
  }

  // Strategy 1: Jina AI Web Reader (Open CORS, high uptime, parses JS/Cloudflare sites into clean structured Markdown)
  try {
    const jinaUrl = `https://r.jina.ai/${pageUrl}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 7500);
    const res = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "markdown",
      },
      signal: controller.signal,
    });
    clearTimeout(t);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 150 && !text.includes("403 Forbidden") && !text.includes("Cloudflare")) {
        return { text, isMarkdown: true, engine: "Jina AI Web Reader (APK Ready)" };
      }
    }
  } catch {
    // next proxy
  }

  // Strategy 2: AllOrigins RAW & GET APIs
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6500);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) {
        return { text, isMarkdown: false, engine: "AllOrigins Raw Proxy" };
      }
    }
  } catch {
    // try AllOrigins JSON
    try {
      const proxyUrlJson = `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6500);
      const res = await fetch(proxyUrlJson, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        const json = await res.json();
        if (json && json.contents && json.contents.length > 200) {
          return { text: json.contents, isMarkdown: false, engine: "AllOrigins JSON Proxy" };
        }
      }
    } catch {
      // next proxy
    }
  }

  // Strategy 3: CodeTabs Proxy
  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(pageUrl)}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6500);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) {
        return { text, isMarkdown: false, engine: "CodeTabs Proxy" };
      }
    }
  } catch {
    // next proxy
  }

  // Strategy 4: CorsProxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(pageUrl)}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 7500);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) {
        return { text, isMarkdown: false, engine: "CorsProxy.io" };
      }
    }
  } catch {
    // next proxy
  }

  // Strategy 5: Direct Fetch (Standard web / local)
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5500);
    const res = await fetch(pageUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) {
        return { text, isMarkdown: false, engine: "Direct Web Fetch" };
      }
    }
  } catch {
    // CORS blocked
  }

  return null;
}

/**
 * Universal Web Fetcher for Web & APK environments
 */
export async function fetchWebPageUniversal(
  targetUrl: string,
  startPage: number = 1,
  pagesCount: number = 1
): Promise<UniversalFetchResult> {
  const isGematrix = /gematrix\.org/i.test(targetUrl);

  // 1. Try Backend First (Express server /api/fetch-web-text)
  try {
    const controller = new AbortController();
    // Allow up to 35 seconds for batch / multi-page crawling over network
    const timer = setTimeout(() => controller.abort(), 35000);

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
      const data = await backendRes.json().catch(() => null);
      if (
        data &&
        data.success &&
        ((data.structuredItems && data.structuredItems.length > 0) || data.extractedText)
      ) {
        return {
          ...data,
          engineUsed: "Express Server Backend",
        };
      }
    }
  } catch {
    // Backend unavailable (APK / Netlify / Static SPA) - proceed immediately to client-side multi-proxy
  }

  // 2. Build target URLs to fetch
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

  const fetchedResults: Array<{ text: string; isMarkdown: boolean; engine: string }> = [];

  for (const pageUrl of urlsToFetch) {
    const result = await fetchSinglePageResilient(pageUrl);
    if (result) {
      fetchedResults.push(result);
    }
  }

  // 3. Process fetched HTML / Markdown responses
  if (fetchedResults.length > 0) {
    const allStructured: StructuredScrapeItem[] = [];
    const seenPhrases = new Set<string>();
    let detectedPages = 1;
    let fullCleanedText = "";
    const engineNames = Array.from(new Set(fetchedResults.map((r) => r.engine))).join(", ");

    for (const item of fetchedResults) {
      if (item.isMarkdown) {
        const mdItems = extractStructuredGematriaFromMarkdown(item.text);
        mdItems.forEach((it) => {
          const upper = it.phrase.toUpperCase();
          if (!seenPhrases.has(upper)) {
            seenPhrases.add(upper);
            allStructured.push(it);
          }
        });
        fullCleanedText += " " + item.text.replace(/#|\*|`|\[|\]|\(|\)/g, " ");
      } else {
        const parsed = extractStructuredGematriaFromHtml(item.text, targetUrl);
        if (parsed.totalPages > detectedPages) {
          detectedPages = parsed.totalPages;
        }
        parsed.structuredItems.forEach((it) => {
          const upper = it.phrase.toUpperCase();
          if (!seenPhrases.has(upper)) {
            seenPhrases.add(upper);
            allStructured.push(it);
          }
        });
        fullCleanedText += " " + parsed.cleanedText;
      }
    }

    return {
      success: true,
      totalPagesDetected: detectedPages,
      pagesFetched: fetchedResults.length,
      isGematrix,
      engineUsed: engineNames,
      structuredItems: allStructured,
      extractedText: fullCleanedText.trim(),
    };
  }

  // 4. Client-Side Fallback Cache: If external scraping is temporarily blocked by ISP/Firewall in APK
  const wordParamMatch = targetUrl.match(/[?&]word=([^&]+)/i);
  const searchedWord = wordParamMatch ? decodeURIComponent(wordParamMatch[1]).trim() : "";
  const numVal = parseInt(searchedWord, 10);

  if (numVal === 666 || targetUrl.includes("666")) {
    const builtIn666: StructuredScrapeItem[] = (ENGLISH_BASE6_CORPUS[666] || []).map((item) => ({
      phrase: item.text,
      english: 666,
      simple: 111,
    }));
    return {
      success: true,
      totalPagesDetected: 25,
      pagesFetched: 1,
      isGematrix: true,
      engineUsed: "Ενσωματωμένη Βάση Εφαρμογής (APK Offline Cache 666)",
      structuredItems: builtIn666,
      extractedText: builtIn666.map((b) => b.phrase).join(" "),
    };
  }

  if (numVal === 888 || targetUrl.includes("888")) {
    const builtIn888: StructuredScrapeItem[] = (ENGLISH_BASE6_CORPUS[888] || []).map((item) => ({
      phrase: item.text,
      english: 888,
    }));
    return {
      success: true,
      totalPagesDetected: 10,
      pagesFetched: 1,
      isGematrix: true,
      engineUsed: "Ενσωματωμένη Βάση Εφαρμογής (APK Offline Cache 888)",
      structuredItems: builtIn888,
      extractedText: builtIn888.map((b) => b.phrase).join(" "),
    };
  }

  return {
    success: false,
    error:
      "Δεν ήταν δυνατή η απευθείας ανάγνωση του URL μέσω των διαθέσιμων διακομιστών μεσολάβησης. Μπορείτε να ανοίξετε τη σελίδα στον browser, να αντιγράψετε το κείμενο και να το επικολλήσετε στην καρτέλα «Μαζικό Κείμενο (Paste)» για άμεση αυτόματη σάρωση!",
  };
}

