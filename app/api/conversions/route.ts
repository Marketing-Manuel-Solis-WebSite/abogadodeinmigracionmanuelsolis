import { NextRequest, NextResponse } from 'next/server';

// =============================================================
// FASE 4 — Flight Check: Endpoint de registro de conversiones
// Cada conversión se registra en Vercel Logs con formato estructurado.
// Para reporte de conciliación semanal, conectar a Supabase/PlanetScale.
// =============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const conversion = {
      type: body.type,
      source: body.source,
      medium: body.medium,
      campaign: body.campaign || '',
      domain: body.domain,
      label: body.label || '',
      timestamp: body.timestamp,
      recorded_at: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    };

    // Registro estructurado para Vercel Logs (conteo oficial Flight Check)
    console.log(`[FLIGHT_CHECK] ${JSON.stringify(conversion)}`);

    return NextResponse.json({
      success: true,
      id: `fc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    });
  } catch (error) {
    console.error('[FLIGHT_CHECK] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record conversion' },
      { status: 500 }
    );
  }
}
