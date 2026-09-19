const fs = require('fs');
const file = 'src/app/[lang]/page.tsx';
let page = fs.readFileSync(file, 'utf8');

page = page.replace(
  /\{dict\.home\.contactTitle\}/,
  "{lang === 'ar' ? \"جاهزون لمضاعفة أرباح عقاركم بفاس؟\" : \"Prêt à transformer votre bien en machine à cash ?\"}"
);
page = page.replace(
  /\{dict\.home\.contactSubtitle\}/,
  "{lang === 'ar' ? \"اتركوا لنا بياناتكم، وسيتواصل معكم خبير من باب فاس خلال 24 ساعة لتقديم دراسة مجانية.\" : \"Laissez-nous vos coordonnées, un expert BABFEZ vous recontactera sous 24h pour une estimation gratuite.\"}"
);
page = page.replace(
  /\{dict\.home\.simDisclaimer\}/,
  "{lang === 'ar' ? \"هذا التقدير مبني على بيانات السوق بفاس وقد يختلف حسب حالة العقار وموقعه.\" : \"Cette estimation est basée sur nos données de marché à Fès et peut varier selon l'état du bien.\"}"
);
page = page.replace(
  /\{dict\.home\.atoutsTitle\}/,
  "{lang === 'ar' ? \"لماذا تختارون باب فاس؟\" : \"Pourquoi choisir BABFEZ ?\"}"
);
page = page.replace(
  /\{dict\.home\.atoutsSubtitle\}/,
  "{lang === 'ar' ? \"خبرة محلية أصيلة بمعايير فندقية دولية.\" : \"L'expertise locale alliée aux standards internationaux de l'hôtellerie.\"}"
);

page = page.replace(
  /\{ title: dict\.home\.atout1Title, desc: dict\.home\.atout1Desc, icon: \"M9 12l2 2 4-4m5\.618-4\.016A11\.955 11\.955 0 0112 2\.944a11\.955 11\.955 0 01-8\.618 3\.04A12\.02 12\.02 0 003 9c0 5\.591 3\.824 10\.29 9 11\.622 5\.176-1\.332 9-6\.03 9-11\.622 0-1\.042-\.133-2\.052-\.382-3\.016z\" \},/,
  "{ title: lang === 'ar' ? \"استمارات الشرطة\" : \"Fiches de Police\", desc: lang === 'ar' ? \"نتكفل كلياً بالواجب القانوني لاستمارات الشرطة لكل مسافر لدى السلطات المختصة.\" : \"Nous gérons à 100% l'obligation légale des fiches de police pour chaque voyageur auprès des autorités.\", icon: \"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\" },"
);

page = page.replace(
  /\{ title: dict\.home\.atout2Title, desc: dict\.home\.atout2Desc, icon: \"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2\.286 6\.857L21 12l-5\.714 2\.143L13 21l-2\.286-6\.857L5 12l5\.714-2\.143L13 3z\" \},/,
  "{ title: lang === 'ar' ? \"نظافة فندقية احترافية\" : \"Ménage Hôtelier\", desc: lang === 'ar' ? \"فريق نظافة محترف يتدخل بعد كل مغادرة مع غسيل وكي الشراشف بمعايير الفنادق.\" : \"Une équipe de nettoyage professionnelle intervient après chaque départ. Blanchisserie incluse.\", icon: \"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z\" },"
);

page = page.replace(
  /\{ title: dict\.home\.atout3Title, desc: dict\.home\.atout3Desc, icon: \"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6\" \},/,
  "{ title: lang === 'ar' ? \"تسعير يومي ذكي\" : \"Tarification Dynamique\", desc: lang === 'ar' ? \"خوارزمياتنا تعدل الأسعار يومياً لرفع مداخيلكم حسب الطلب والمواسم السياحية.\" : \"Nos algorithmes ajustent vos prix chaque jour pour maximiser vos revenus selon la demande (festivals, vacances).\", icon: \"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6\" },"
);

page = page.replace(
  /\{ title: dict\.home\.atout4Title, desc: dict\.home\.atout4Desc, icon: \"M10\.325 4\.317c\.426-1\.756 2\.924-1\.756 3\.35 0a1\.724 1\.724 0 002\.573 1\.066c1\.543-\.94 3\.31\.826 2\.37 2\.37a1\.724 1\.724 0 001\.065 2\.572c1\.756\.426 1\.756 2\.924 0 3\.35a1\.724 1\.724 0 00-1\.066 2\.573c\.94 1\.543-\.826 3\.31-2\.37 2\.37a1\.724 1\.724 0 00-2\.572 1\.065c-\.426 1\.756-2\.924 1\.756-3\.35 0a1\.724 1\.724 0 00-2\.573-1\.066c-1\.543\.94-3\.31-\.826-2\.37-2\.37a1\.724 1\.724 0 00-1\.065-2\.572c-1\.756-\.426-1\.756-2\.924 0-3\.35a1\.724 1\.724 0 001\.066-2\.573c-\.94-1\.543\.826-3\.31 2\.37-2\.37\.996\.608 2\.296\.07 2\.572-1\.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z\" \}/,
  "{ title: lang === 'ar' ? \"استقبال شخصي مباشر\" : \"Accueil Physique\", desc: lang === 'ar' ? \"لا نعتمد على الصناديق الباردة. فريق باب فاس يستقبل ضيوفكم بابتسامة وترحاب فاسي أصيل.\" : \"Pas de boîte à clés impersonnelle. Un concierge BABFEZ accueille vos voyageurs avec le sourire.\", icon: \"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z\" }"
);

page = page.replace(
  /\{dict\.home\.faqTitle\}/,
  "{lang === 'ar' ? \"الأسئلة الشائعة\" : \"Questions Fréquentes\"}"
);
page = page.replace(
  /\{dict\.home\.faqSubtitle\}/,
  "{lang === 'ar' ? \"كل ما تحتاجون معرفته حول إدارة الكراء مع باب فاس.\" : \"Tout ce que vous devez savoir sur la gestion avec BABFEZ.\"}"
);
page = page.replace(
  /\{ q: dict\.home\.faqQ1, a: dict\.home\.faqA1 \},/,
  "{ q: lang === 'ar' ? \"هل يمكنني حجز شقتي لإقامتي الشخصية؟\" : \"Puis-je bloquer des dates pour moi-même ?\", a: lang === 'ar' ? \"نعم، بكل تأكيد. تحتفظون بحرية حجز وإغلاق التواريخ التي تناسبكم لقضاء عطلتكم عبر فضاء المالك الخاص بكم.\" : \"Oui, tout à fait. Vous gardez la liberté de bloquer les dates qui vous conviennent pour y passer vos vacances via votre Espace Propriétaire.\" },"
);
page = page.replace(
  /\{ q: dict\.home\.faqQ2, a: dict\.home\.faqA2 \},/,
  "{ q: lang === 'ar' ? \"من يتحمل مصاريف النظافة؟\" : \"Qui paie les frais de ménage ?\", a: lang === 'ar' ? \"يتحملها المسافر مباشرة كرسوم إضافية على الإقامة، ولا تقتطع من أرباح المالك.\" : \"Ils sont à la charge directe du voyageur comme frais additionnels lors de la réservation, ils ne sont pas déduits de vos revenus.\" },"
);
page = page.replace(
  /\{ q: dict\.home\.faqQ3, a: dict\.home\.faqA3 \}/,
  "{ q: lang === 'ar' ? \"كيف يمكنني متابعة أرباحي وحجوزاتي؟\" : \"Comment suivez-vous les revenus ?\", a: lang === 'ar' ? \"عبر لوحة تحكم رقمية خاصة بكم تعرض الحجوزات والمداخيل بكل شفافية.\" : \"Via votre tableau de bord digital personnalisé qui affiche vos réservations et vos revenus en toute transparence.\" }"
);

fs.writeFileSync(file, page);
