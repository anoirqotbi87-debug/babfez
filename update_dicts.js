const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, 'src', 'dictionaries');

// Common structure for new translations as requested by user
const newTranslations = {
  nav: {
    simulator: { fr: "Simulateur", en: "Simulator", es: "Simulador", ar: "حاسبة المداخيل" },
    services: { fr: "Nos Formules", en: "Our Plans", es: "Nuestros Planes", ar: "عروضنا" },
    advantages: { fr: "Pourquoi nous", en: "Why Us", es: "Por qué nosotros", ar: "لماذا نحن" },
    properties: { fr: "Nos Logements", en: "Our Properties", es: "Nuestros Alojamientos", ar: "عقاراتنا" },
    faq: { fr: "FAQ", en: "FAQ", es: "Preguntas frecuentes", ar: "الأسئلة الشائعة" },
    ownerSpace: { fr: "Espace Propriétaire", en: "Owner Portal", es: "Área de Propietarios", ar: "فضاء المالك" },
    estimateBtn: { fr: "Estimer mon bien", en: "Estimate My Property", es: "Estimar mi propiedad", ar: "تقييم عقاري" },
    backHome: { fr: "← Retour à l'accueil", en: "← Back to Home", es: "← Volver al inicio", ar: "← العودة للرئيسية" }
  },
  hero: {
    badge: { fr: "BABFEZ • Gestion locative courte durée à Fès", en: "BABFEZ • Short-Term Rental Management in Fez", es: "BABFEZ • Gestión de Alquiler Vacacional en Fez", ar: "باب فاس • إدارة الكراء السياحي واليومي بفاس" },
    title: { fr: "Ouvrez grand les portes de vos revenus locatifs.", en: "Unlock the full potential of your rental income.", es: "Abra las puertas al máximo rendimiento de su propiedad.", ar: "افتحوا أبواب مداخيلكم العقارية بأعلى مردودية." },
    subtitle: { fr: "Confiez-nous l'intendance complète de votre appartement ou Riad à Fès. De l'accueil personnalisé au ménage hôtelier et aux fiches de police, BABFEZ gère chaque détail avec rigueur.", en: "Entrust us with the complete management of your apartment or Riad in Fez. From personalized check-ins to hotel-standard cleaning and legal police forms, BABFEZ manages every detail.", es: "Confíenos la gestión integral de su apartamento o Riad en Fez. Desde la bienvenida personalizada hasta la limpieza hotelera y las fichas de policía, BABFEZ cuida cada detalle.", ar: "فوضوا لنا الإدارة الشاملة لشقتكم أو رياضكم بفاس. من الاستقبال الفندقي والنظافة الاحترافية إلى استمارات الشرطة القانونية، نتكفل بكل التفاصيل بكل دقة." },
    kpi1: { fr: "+40% Revenu vs location classique", en: "+40% Income vs long-term rental", es: "+40% Ingresos vs alquiler tradicional", ar: "+40% مدخول مقارنة بالكراء التقليدي" },
    kpi2: { fr: "100% Conformité fiches de police", en: "100% Police forms compliance", es: "100% Conformidad policial", ar: "100% التزام باستمارات الشرطة القانونية" },
    kpi3: { fr: "24/7 Assistance voyageurs", en: "24/7 Guest support", es: "24/7 Asistencia a huéspedes", ar: "24/7 مرافقة واستقبال للضيوف" }
  },
  simulator: {
    title: { fr: "Combien votre logement peut-il générer ?", en: "How much can your property earn?", es: "¿Cuánto puede generar su propiedad?", ar: "كم يمكن لعقارك أن يدخل شهرياً؟" },
    zoneLabel: { fr: "Zone du bien à Fès", en: "Area in Fez", es: "Zona en Fez", ar: "موقع العقار بفاس" },
    zoneMedina: { fr: "Médina / Riad (Zone touristique forte)", en: "Medina / Riad (High tourist area)", es: "Medina / Riad (Zona turística)", ar: "المدينة القديمة / رياض (منطقة سياحية كبرى)" },
    zoneVilleNouvelle: { fr: "Ville Nouvelle / Atlas / Champs de Course", en: "New Town / Atlas / Champs de Course", es: "Ciudad Nueva / Atlas / Champs de Course", ar: "المدينة الجديدة / الأطلس / حلبة السباق" },
    zoneImmouzzer: { fr: "Route d'Immouzzer / Résidences récentes", en: "Immouzzer Road / Modern residences", es: "Carretera de Immouzzer / Residencias modernas", ar: "طريق إيموزار / إقامات حديثة" },
    typeLabel: { fr: "Type de bien", en: "Property Type", es: "Tipo de propiedad", ar: "نوع العقار" },
    typeApartment: { fr: "Appartement moderne", en: "Modern Apartment", es: "Apartamento moderno", ar: "شقة حديثة" },
    typeRiad: { fr: "Riad traditionnel", en: "Traditional Riad", es: "Riad tradicional", ar: "رياض تقليدي" },
    typeVilla: { fr: "Villa", en: "Villa", es: "Villa", ar: "فيلا" },
    roomStudio: { fr: "Studio", en: "Studio", es: "Estudio", ar: "استوديو" },
    room1: { fr: "1 Chambre", en: "1 Bedroom", es: "1 Habitación", ar: "غرفة واحدة" },
    room2: { fr: "2 Chambres", en: "2 Bedrooms", es: "2 Habitaciones", ar: "غرفتان" },
    room3: { fr: "3 Chambres", en: "3 Bedrooms", es: "3 Habitaciones", ar: "3 غرف" },
    room4: { fr: "4+ Ch (Riad/Villa)", en: "4+ Beds (Riad/Villa)", es: "4+ Hab (Riad/Villa)", ar: "4 غرف فأكثر (رياض/فيلا)" },
    occupancy: { fr: "Taux d'occupation estimé", en: "Estimated occupancy rate", es: "Tasa de ocupación estimada", ar: "نسبة الإشغال المتوقعة" },
    monthlyGross: { fr: "Revenu mensuel brut estimé", en: "Estimated monthly gross revenue", es: "Ingresos mensuales brutos estimados", ar: "المدخول الشهري الإجمالي المقدر" },
    annualGross: { fr: "Soit environ {amount} par an", en: "Approximately {amount} per year", es: "Aprox. {amount} al año", ar: "أي ما يقارب {amount} سنوياً" },
    avgRate: { fr: "Tarif moyen simulé : {amount} / nuit", en: "Simulated average rate: {amount} / night", es: "Tarifa media: {amount} / noche", ar: "المعدل اليومي المعتمد: {amount} / ليلة" },
    ctaQuote: { fr: "Obtenir une étude précise", en: "Get an Exact Study", es: "Obtener un estudio preciso", ar: "الحصول على دراسة تفصيلية" }
  },
  contact: {
    fullName: { fr: "Nom & Prénom", en: "Full Name", es: "Nombre completo", ar: "الاسم واللقب" },
    email: { fr: "Adresse E-mail", en: "Email Address", es: "Correo electrónico", ar: "البريد الإلكتروني" },
    phone: { fr: "Téléphone / WhatsApp", en: "Phone / WhatsApp", es: "Teléfono / WhatsApp", ar: "الهاتف / واتساب" },
    area: { fr: "Quartier du bien à Fès", en: "Neighborhood in Fez", es: "Barrio en Fez", ar: "الحي بفاس" },
    surface: { fr: "Superficie approximative (m²)", en: "Approximate size (sqm)", es: "Superficie aprox. (m²)", ar: "المساحة التقريبية (م²)" },
    plan: { fr: "Formule souhaitée", en: "Preferred Plan", es: "Plan preferido", ar: "العرض المطلوب" },
    planSerenite: { fr: "Gestion Sérénité (20-25%)", en: "Serenity Management (20-25%)", es: "Gestión Serenidad (20-25%)", ar: "إدارة شاملة ومريحة (20-25%)" },
    planDigital: { fr: "Gestion Digitale (15%)", en: "Digital Co-Host (15%)", es: "Gestión Digital (15%)", ar: "إدارة رقمية عن بعد (15%)" },
    planCustom: { fr: "Services À la carte", en: "A la Carte Services", es: "Servicios A la Carta", ar: "خدمات حسب الطلب" },
    message: { fr: "Détails sur votre bien", en: "Details about your property", es: "Detalles de su propiedad", ar: "تفاصيل إضافية عن العقار" },
    consent: { fr: "J'accepte d'être recontacté par BABFEZ pour mon estimation locative.", en: "I agree to be contacted by BABFEZ regarding my rental estimate.", es: "Acepto ser contactado por BABFEZ para la estimación de alquiler.", ar: "أوافق على التواصل معي من طرف باب فاس بخصوص التقدير المالي لعقاري." },
    submitBtn: { fr: "Demander mon audit & estimation gratuite", en: "Request My Free Audit & Estimate", es: "Solicitar mi auditoría y valoración gratuita", ar: "طلب دراسة وتقييم مجاني لعقاري" }
  },
  booking: {
    searchTitle: { fr: "Réservez votre séjour d'exception à Fès", en: "Book your exceptional stay in Fez", es: "Reserve su estancia excepcional en Fez", ar: "احجزوا إقامة استثنائية بفاس" },
    checkIn: { fr: "Arrivée", en: "Check-in", es: "Llegada", ar: "تاريخ الوصول" },
    checkOut: { fr: "Départ", en: "Check-out", es: "Salida", ar: "تاريخ المغادرة" },
    guests: { fr: "Voyageurs", en: "Guests", es: "Huéspedes", ar: "الضيوف" },
    adults: { fr: "Adultes", en: "Adults", es: "Adultos", ar: "البالغين" },
    children: { fr: "Enfants", en: "Children", es: "Niños", ar: "الأطفال" },
    filterBtn: { fr: "Filtrer les logements", en: "Filter Properties", es: "Filtrar alojamientos", ar: "تصفية العقارات" },
    perNight: { fr: "par nuit", en: "per night", es: "por noche", ar: "لليلة الواحدة" },
    cleaningFee: { fr: "Frais de ménage", en: "Cleaning fee", es: "Gastos de limpieza", ar: "رسوم النظافة الفندقية" },
    totalStay: { fr: "Total séjour", en: "Total stay", es: "Total estancia", ar: "المجموع الإجمالي" },
    arrivalTime: { fr: "Heure estimée d'arrivée", en: "Estimated arrival time", es: "Hora estimada de llegada", ar: "الوقت المقدر للوصول" },
    specialRequests: { fr: "Demandes particulières", en: "Special requests", es: "Peticiones especiales", ar: "طلبات خاصة" },
    confirmWhatsapp: { fr: "Confirmer ma demande via WhatsApp", en: "Confirm My Request via WhatsApp", es: "Confirmar mi solicitud por WhatsApp", ar: "تأكيد الحجز عبر واتساب" },
    badgeHotelStandard: { fr: "Accueil physique ou boîte à clés • Fiches de police incluses", en: "In-person check-in or lockbox • Police forms included", es: "Check-in en persona o caja de llaves • Fichas policiales incluidas", ar: "استقبال حضوري أو صندوق مفاتيح آمن • استمارات الشرطة متكفل بها" }
  }
};

const langs = ['fr', 'en', 'es', 'ar'];

for (const lang of langs) {
  const filePath = path.join(dictPath, `${lang}.json`);
  let dict = {};
  if (fs.existsSync(filePath)) {
    dict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // Merge missing categories
  ['nav', 'hero', 'simulator', 'contact', 'booking'].forEach(category => {
    if (!dict[category]) dict[category] = {};
    for (const [key, translations] of Object.entries(newTranslations[category])) {
      dict[category][key] = translations[lang];
    }
  });

  // For Arabic, copy everything else from French as fallback if not present
  if (lang === 'ar') {
    const frDict = JSON.parse(fs.readFileSync(path.join(dictPath, 'fr.json'), 'utf8'));
    for (const [key, obj] of Object.entries(frDict)) {
      if (typeof obj === 'object') {
        if (!dict[key]) dict[key] = {};
        for (const [innerKey, val] of Object.entries(obj)) {
          if (!dict[key][innerKey]) dict[key][innerKey] = val;
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2));
}

console.log('Dictionaries updated successfully.');
