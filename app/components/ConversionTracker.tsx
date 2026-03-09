'use client';

import { useEffect } from 'react';
import { trackFullConversion } from '../lib/tracking';

// =============================================================
// FASE 3: Listener global de clics en enlaces tel: y wa.me
// Captura TODOS los clics en <a href="tel:..."> y <a href="...wa.me...">
// sin necesidad de modificar cada componente individual.
// Cubre: Header, Oficinas, Servicios, Clientes Detenidos, etc.
// =============================================================

function getPhoneLabel(element: HTMLAnchorElement): string {
  if (element.closest('header')) return 'header_phone_button';
  if (window.location.pathname.includes('/oficinas/')) return 'office_phone_button';
  if (window.location.pathname.includes('/servicios/')) return 'service_phone_button';
  if (window.location.pathname.includes('/clientes-detenidos')) return 'detained_phone_button';
  return 'phone_button';
}

export default function ConversionTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';

      // phone_click — enlaces tel:
      if (href.includes('tel:')) {
        const phoneNumber = href.replace('tel:', '').replace(/\D/g, '');
        trackFullConversion('phone_click', getPhoneLabel(anchor), {
          phone_number: phoneNumber,
          page_path: window.location.pathname,
        });
      }

      // whatsapp_click — enlaces wa.me o api.whatsapp.com
      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackFullConversion('whatsapp_click', 'whatsapp_link', {
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
