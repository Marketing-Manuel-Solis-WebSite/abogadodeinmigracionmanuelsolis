// app/api/zapier-contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Webhooks de Zapier proporcionados
const ZAPIER_URLS = {
    es: 'https://hooks.zapier.com/hooks/catch/23998383/u4rkb5i/',
    en: 'https://hooks.zapier.com/hooks/catch/23998383/u4rffjf/',
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { language, ...formData } = body;

        // Seleccionar el webhook basado en el idioma (por defecto español si falla)
        const webhookUrl = language === 'en' ? ZAPIER_URLS.en : ZAPIER_URLS.es;

        // Enviar datos a Zapier
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({
                ...formData,
                submittedAt: new Date().toISOString(),
                source: 'Website Contact Form'
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Zapier error' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}