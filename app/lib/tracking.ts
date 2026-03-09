// =============================================================
// FASE 3 & 4: Sistema de Tracking de Conversiones
// Double Check (dataLayer → GTM → GA4) + Flight Check (API)
// =============================================================

export type ConversionType = 'form_submit' | 'phone_click' | 'whatsapp_click' | 'qualified_lead';

interface ConversionEvent {
  type: ConversionType;
  source: string;
  medium: string;
  campaign?: string;
  domain: string;
  timestamp: string;
  label?: string;
}

// --- FLIGHT CHECK: Registro server-side de cada conversión ---
export async function trackConversion(event: ConversionEvent): Promise<void> {
  try {
    await fetch('/api/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('[Flight Check] Error:', error);
  }
}

// --- DOUBLE CHECK: Push al dataLayer para GTM → GA4 ---
export function pushToDataLayer(data: {
  event: string;
  event_category: string;
  event_label: string;
  [key: string]: string;
}): void {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(data);
  }
}

// --- Helper: Obtener parámetros UTM de la URL actual ---
export function getUTMParams(): { source: string; medium: string; campaign: string } {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none', campaign: '' };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaign: params.get('utm_campaign') || '',
  };
}

// --- Combinado: dataLayer (Double Check) + API (Flight Check) ---
export function trackFullConversion(
  type: ConversionType,
  label: string,
  extraData?: Record<string, string>
): void {
  const utm = getUTMParams();

  // 1. Double Check → dataLayer → GTM → GA4
  pushToDataLayer({
    event: type,
    event_category: 'conversion',
    event_label: label,
    ...extraData,
  });

  // 2. Flight Check → Server-side API
  trackConversion({
    type,
    source: utm.source,
    medium: utm.medium,
    campaign: utm.campaign,
    domain: typeof window !== 'undefined' ? window.location.hostname : '',
    timestamp: new Date().toISOString(),
    label,
  });
}
