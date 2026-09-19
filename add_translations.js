const fs = require('fs');
const path = require('path');

const dictsDir = 'src/dictionaries';

const newDicts = {
  services: {
    fr: {
      title: "Nos Formules de Gestion",
      subtitle: "Choisissez l'accompagnement qui correspond à votre profil de propriétaire",
      f1Title: "Services À la Carte",
      f1Price: "À l'acte",
      f1Desc: "Interventions ponctuelles pour propriétaires autonomes.",
      f1Bullets: ["Check-in physique & fiches de police (150 MAD)", "Check-out & état des lieux (100 MAD)", "Ménage & blanchisserie à la demande", "Pack Shooting photo professionnel & Home staging", "Dépannage & maintenance d'urgence"],
      f2Title: "Gestion Digitale",
      f2Price: "15% TTC",
      f2Desc: "Vous gérez le terrain, nous maximisons vos réservations 24/7.",
      f2Bullets: ["Création & optimisation SEO multi-plateformes", "Tarification dynamique quotidienne (Yield Management)", "Messagerie & assistance voyageurs 24/7", "Synchronisation des calendriers anti-doublon (iCal)", "Relevé financier mensuel transparent"],
      f3Title: "Gestion Sérénité",
      f3Price: "20% TTC",
      f3Desc: "Délégation complète à 100% pour une tranquillité absolue.",
      f3Badge: "Populaire / Recommandé",
      f3Bullets: ["Tout ce qui est inclus dans l'offre Digitale", "Accueil physique personnalisé ou boîte à clés", "Prise en charge 100% légale des fiches de police", "Organisation du ménage hôtelier & blanchisserie", "Gestion des cautions & litiges plateformes", "Espace Propriétaire en ligne dédié"],
      f4Title: "Gestion Premium",
      f4Price: "25% TTC",
      f4Desc: "L'expérience hôtelière de luxe pour Riads et appartements d'exception.",
      f4Badge: "Excellence",
      f4Bullets: ["Tout ce qui est inclus dans l'offre Sérénité", "Shooting photo professionnel offert dès la signature", "Conciergerie VIP voyageurs (transferts aéroport, excursions)", "Pack d'accueil haut de gamme offert à chaque arrivée", "Maintenance préventive prioritaire avec artisans dédiés", "Gestionnaire de compte dédié joignable 7j/7"]
    },
    en: {
      title: "Our Management Plans",
      subtitle: "Choose the support that fits your owner profile",
      f1Title: "A la Carte Services",
      f1Price: "Per Service",
      f1Desc: "One-off interventions for independent owners.",
      f1Bullets: ["Physical check-in & police forms (150 MAD)", "Check-out & inventory (100 MAD)", "Cleaning & laundry on demand", "Professional photo shoot & Home staging pack", "Emergency troubleshooting & maintenance"],
      f2Title: "Digital Co-Host",
      f2Price: "15% Incl. Tax",
      f2Desc: "You manage the field, we maximize your bookings 24/7.",
      f2Bullets: ["Creation & SEO optimization on multiple platforms", "Daily dynamic pricing (Yield Management)", "24/7 guest messaging & assistance", "Anti-double booking calendar synchronization (iCal)", "Transparent monthly financial statement"],
      f3Title: "Serenity Management",
      f3Price: "20% Incl. Tax",
      f3Desc: "100% complete delegation for absolute peace of mind.",
      f3Badge: "Recommended",
      f3Bullets: ["Everything included in the Digital plan", "Personalized physical welcome or lockbox", "100% legal handling of police forms", "Organization of hotel-quality cleaning & laundry", "Management of deposits & platform disputes", "Dedicated online Owner Space"],
      f4Title: "Premium Management",
      f4Price: "25% Incl. Tax",
      f4Desc: "The luxury hotel experience for exceptional Riads and apartments.",
      f4Badge: "Excellence",
      f4Bullets: ["Everything included in the Serenity plan", "Professional photo shoot offered upon signing", "VIP guest concierge (airport transfers, excursions)", "Premium welcome pack offered at each arrival", "Priority preventive maintenance with dedicated craftsmen", "Dedicated account manager available 7 days a week"]
    },
    es: {
      title: "Nuestros Planes de Gestión",
      subtitle: "Elija el apoyo que se adapte a su perfil de propietario",
      f1Title: "Servicios a la Carta",
      f1Price: "Por servicio",
      f1Desc: "Intervenciones puntuales para propietarios independientes.",
      f1Bullets: ["Check-in físico y fichas policiales (150 MAD)", "Check-out e inventario (100 MAD)", "Limpieza y lavandería bajo demanda", "Pack de sesión de fotos profesional y Home staging", "Resolución de problemas de emergencia y mantenimiento"],
      f2Title: "Gestión Digital",
      f2Price: "15% IVA Incl.",
      f2Desc: "Usted gestiona el terreno, nosotros maximizamos sus reservas 24/7.",
      f2Bullets: ["Creación y optimización SEO en múltiples plataformas", "Precios dinámicos diarios (Yield Management)", "Mensajería y asistencia a huéspedes 24/7", "Sincronización de calendarios anti-doble reserva (iCal)", "Estado financiero mensual transparente"],
      f3Title: "Gestión Serenidad",
      f3Price: "20% IVA Incl.",
      f3Desc: "Delegación 100% completa para una tranquilidad absoluta.",
      f3Badge: "Recomendado",
      f3Bullets: ["Todo lo incluido en el plan Digital", "Bienvenida física personalizada o caja de seguridad", "Gestión 100% legal de fichas policiales", "Organización de limpieza y lavandería de calidad hotelera", "Gestión de depósitos y disputas de plataformas", "Espacio de Propietario en línea dedicado"],
      f4Title: "Gestión Premium",
      f4Price: "25% IVA Incl.",
      f4Desc: "La experiencia de un hotel de lujo para Riads y apartamentos excepcionales.",
      f4Badge: "Excelencia",
      f4Bullets: ["Todo lo incluido en el plan Serenidad", "Sesión de fotos profesional ofrecida al firmar", "Conserje VIP para huéspedes (traslados al aeropuerto, excursiones)", "Paquete de bienvenida premium en cada llegada", "Mantenimiento preventivo prioritario con artesanos dedicados", "Gerente de cuenta dedicado disponible los 7 días de la semana"]
    },
    ar: {
      title: "عروضنا للإدارة",
      subtitle: "اختر الدعم الذي يناسب ملفك كمالك",
      f1Title: "خدمات حسب الطلب",
      f1Price: "حسب الخدمة",
      f1Desc: "تدخلات محددة للملاك المستقلين.",
      f1Bullets: ["تسجيل الوصول الشخصي واستمارات الشرطة (150 درهم)", "تسجيل المغادرة والجرد (100 درهم)", "تنظيف وغسيل الملابس عند الطلب", "باقة تصوير احترافي وتهيئة المنزل", "إصلاح الأعطال الطارئة والصيانة"],
      f2Title: "الإدارة الرقمية",
      f2Price: "15٪ شامل للضريبة",
      f2Desc: "أنت تدير الميدان، ونحن نزيد حجوزاتك على مدار الساعة.",
      f2Bullets: ["إنشاء وتحسين الظهور على منصات متعددة", "تسعير ديناميكي يومي", "مراسلة ومساعدة الضيوف على مدار الساعة", "مزامنة التقويم لمنع الحجوزات المزدوجة", "كشف حساب مالي شهري شفاف"],
      f3Title: "الإدارة الشاملة",
      f3Price: "20٪ شامل للضريبة",
      f3Desc: "تفويض كامل بنسبة 100٪ لراحة بال تامة.",
      f3Badge: "موصى به",
      f3Bullets: ["كل ما يشمله العرض الرقمي", "استقبال شخصي أو صندوق مفاتيح", "تكفل قانوني 100٪ باستمارات الشرطة", "تنظيم تنظيف وغسيل بمعايير فندقية", "إدارة التأمينات ونزاعات المنصات", "فضاء إلكتروني خاص بالمالك"],
      f4Title: "الإدارة الممتازة",
      f4Price: "25٪ شامل للضريبة",
      f4Desc: "تجربة فندقية فاخرة للرياضات والشقق الاستثنائية.",
      f4Badge: "امتياز",
      f4Bullets: ["كل ما يشمله عرض الإدارة الشاملة", "جلسة تصوير احترافية مجانية عند التوقيع", "كونسيرج لكبار الشخصيات (نقل المطار، رحلات)", "باقة ترحيب فاخرة عند كل وصول", "صيانة وقائية ذات أولوية مع حرفيين متخصصين", "مدير حساب مخصص متاح طوال أيام الأسبوع"]
    }
  },
  advantages: {
    fr: {
      title: "Pourquoi choisir BABFEZ ?",
      subtitle: "L'expertise locale alliée aux standards internationaux de l'hôtellerie.",
      f1Title: "Fiches de Police",
      f1Desc: "Nous gérons à 100% l'obligation légale des fiches de police pour chaque voyageur auprès des autorités.",
      f2Title: "Ménage Hôtelier",
      f2Desc: "Une équipe de nettoyage professionnelle intervient après chaque départ. Blanchisserie incluse.",
      f3Title: "Tarification Dynamique",
      f3Desc: "Nos algorithmes ajustent vos prix chaque jour pour maximiser vos revenus selon la demande (festivals, vacances).",
      f4Title: "Accueil Physique",
      f4Desc: "Pas de boîte à clés impersonnelle. Un concierge BABFEZ accueille vos voyageurs avec le sourire."
    },
    en: {
      title: "Why choose BABFEZ?",
      subtitle: "Local expertise combined with international hospitality standards.",
      f1Title: "Police Forms",
      f1Desc: "We manage 100% of the legal obligation of police forms for each traveler with the authorities.",
      f2Title: "Hotel Cleaning",
      f2Desc: "A professional cleaning team intervenes after each departure. Laundry included.",
      f3Title: "Dynamic Pricing",
      f3Desc: "Our algorithms adjust your prices daily to maximize your revenue according to demand.",
      f4Title: "Physical Welcome",
      f4Desc: "No impersonal lockboxes. A BABFEZ concierge welcomes your travelers with a smile."
    },
    es: {
      title: "¿Por qué elegir BABFEZ?",
      subtitle: "Experiencia local combinada con estándares de hospitalidad internacional.",
      f1Title: "Fichas Policiales",
      f1Desc: "Gestionamos el 100% de la obligación legal de fichas policiales para cada viajero ante las autoridades.",
      f2Title: "Limpieza de Hotel",
      f2Desc: "Un equipo de limpieza profesional interviene después de cada salida. Lavandería incluida.",
      f3Title: "Precios Dinámicos",
      f3Desc: "Nuestros algoritmos ajustan sus precios diariamente para maximizar sus ingresos de acuerdo con la demanda.",
      f4Title: "Bienvenida Física",
      f4Desc: "Sin cajas de seguridad impersonales. Un conserje de BABFEZ da la bienvenida a sus viajeros con una sonrisa."
    },
    ar: {
      title: "لماذا تختارون باب فاس؟",
      subtitle: "خبرة محلية أصيلة بمعايير فندقية دولية.",
      f1Title: "استمارات الشرطة",
      f1Desc: "نتكفل كلياً بالواجب القانوني لاستمارات الشرطة لكل مسافر لدى السلطات المختصة.",
      f2Title: "نظافة فندقية احترافية",
      f2Desc: "فريق نظافة محترف يتدخل بعد كل مغادرة مع غسيل وكي الشراشف بمعايير الفنادق.",
      f3Title: "تسعير يومي ذكي",
      f3Desc: "خوارزمياتنا تعدل الأسعار يومياً لرفع مداخيلكم حسب الطلب والمواسم السياحية.",
      f4Title: "استقبال شخصي مباشر",
      f4Desc: "لا نعتمد على الصناديق الباردة. فريق باب فاس يستقبل ضيوفكم بابتسامة وترحاب فاسي أصيل."
    }
  },
  faq: {
    fr: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir sur la gestion avec BABFEZ.",
      q1: "Puis-je bloquer des dates pour moi-même ?",
      a1: "Oui, tout à fait. Vous gardez la liberté de bloquer les dates qui vous conviennent pour y passer vos vacances via votre Espace Propriétaire.",
      q2: "Qui paie les frais de ménage ?",
      a2: "Ils sont à la charge directe du voyageur comme frais additionnels lors de la réservation, ils ne sont pas déduits de vos revenus.",
      q3: "Comment suivez-vous les revenus ?",
      a3: "Via votre tableau de bord digital personnalisé qui affiche vos réservations et vos revenus en toute transparence."
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about management with BABFEZ.",
      q1: "Can I block dates for myself?",
      a1: "Yes, absolutely. You retain the freedom to block dates that suit you for your vacations via your Owner Space.",
      q2: "Who pays the cleaning fees?",
      a2: "They are the direct responsibility of the traveler as additional fees at the time of booking, they are not deducted from your revenue.",
      q3: "How do you track revenue?",
      a3: "Via your personalized digital dashboard that transparently displays your bookings and revenue."
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesita saber sobre la gestión con BABFEZ.",
      q1: "¿Puedo bloquear fechas para mí?",
      a1: "Sí, absolutamente. Usted conserva la libertad de bloquear las fechas que le convengan para sus vacaciones a través de su Espacio de Propietario.",
      q2: "¿Quién paga los gastos de limpieza?",
      a2: "Son responsabilidad directa del viajero como tarifas adicionales al momento de la reserva, no se deducen de sus ingresos.",
      q3: "¿Cómo rastrea los ingresos?",
      a3: "A través de su panel digital personalizado que muestra de manera transparente sus reservas e ingresos."
    },
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "كل ما تحتاجون معرفته حول إدارة الكراء مع باب فاس.",
      q1: "هل يمكنني حجز شقتي لإقامتي الشخصية؟",
      a1: "نعم، بكل تأكيد. تحتفظون بحرية حجز وإغلاق التواريخ التي تناسبكم لقضاء عطلتكم عبر فضاء المالك الخاص بكم.",
      q2: "من يتحمل مصاريف النظافة؟",
      a2: "يتحملها المسافر مباشرة كرسوم إضافية على الإقامة، ولا تقتطع من أرباح المالك.",
      q3: "كيف يمكنني متابعة أرباحي وحجوزاتي؟",
      a3: "عبر لوحة تحكم رقمية خاصة بكم تعرض الحجوزات والمداخيل بكل شفافية."
    }
  },
  contact: {
    fr: {
      heading: "Prêt à transformer votre bien en machine à cash ?",
      subheading: "Laissez-nous vos coordonnées, un expert BABFEZ vous recontactera sous 24h pour une estimation gratuite."
    },
    en: {
      heading: "Ready to turn your property into a cash machine?",
      subheading: "Leave us your details, a BABFEZ expert will contact you within 24 hours for a free estimation."
    },
    es: {
      heading: "¿Listo para convertir su propiedad en una máquina de efectivo?",
      subheading: "Déjenos sus datos, un experto de BABFEZ se pondrá en contacto con usted en 24 horas para una estimación gratuita."
    },
    ar: {
      heading: "جاهزون لمضاعفة أرباح عقاركم بفاس؟",
      subheading: "اتركوا لنا بياناتكم، وسيتواصل معكم خبير من باب فاس خلال 24 ساعة لتقديم دراسة مجانية."
    }
  },
  footer: {
    fr: {
      slogan: "Votre partenaire d'excellence pour la gestion locative courte durée et la conciergerie privée.",
      servicesTitle: "Nos Services",
      navTitle: "Navigation",
      contactTitle: "Contact & Permanence",
      address: "Fès, Maroc (Médina & Ville Nouvelle)",
      availability: "7j/7 — 24h/24 pour les urgences",
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      tos: "Conditions Générales",
      copyright: "© 2026 BABFEZ Conciergerie. Tous droits réservés."
    },
    en: {
      slogan: "Your partner of excellence for short-term rental management and private concierge services.",
      servicesTitle: "Our Services",
      navTitle: "Navigation",
      contactTitle: "Contact & Support",
      address: "Fez, Morocco (Medina & New City)",
      availability: "24/7 for emergencies",
      legal: "Legal Notice",
      privacy: "Privacy Policy",
      tos: "Terms & Conditions",
      copyright: "© 2026 BABFEZ Conciergerie. All rights reserved."
    },
    es: {
      slogan: "Su socio de excelencia para la gestión de alquileres a corto plazo y servicios de conserjería privada.",
      servicesTitle: "Nuestros Servicios",
      navTitle: "Navegación",
      contactTitle: "Contacto y Soporte",
      address: "Fez, Marruecos (Medina y Ciudad Nueva)",
      availability: "24/7 para emergencias",
      legal: "Aviso Legal",
      privacy: "Política de Privacidad",
      tos: "Términos y Condiciones",
      copyright: "© 2026 BABFEZ Conciergerie. Todos los derechos reservados."
    },
    ar: {
      slogan: "شريككم المتميز لإدارة الكراء القصير الأمد والكونسيرج الخاص.",
      servicesTitle: "خدماتنا",
      navTitle: "روابط سريعة",
      contactTitle: "التواصل والمداومة",
      address: "فاس، المغرب (المدينة القديمة والجديدة)",
      availability: "7 أيام / 7 — 24 ساعة للطوارئ",
      legal: "الشروط القانونية",
      privacy: "سياسة الخصوصية",
      tos: "الشروط العامة",
      copyright: "© 2026 باب فاس للكونسيرج. جميع الحقوق محفوظة."
    }
  }
};

['fr', 'en', 'es', 'ar'].forEach(lang => {
  const p = path.join(dictsDir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(p)) {
    data = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  
  Object.keys(newDicts).forEach(key => {
    if (!data[key]) data[key] = {};
    Object.assign(data[key], newDicts[key][lang]);
  });
  
  // ensure proper ASCII encoding to match vercel fix!
  let jsonString = JSON.stringify(data, null, 2);
  if (lang === 'ar') {
     jsonString = jsonString.replace(/[\u007F-\uFFFF]/g, function(chr) {
       return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
     });
  }
  fs.writeFileSync(p, jsonString);
});
