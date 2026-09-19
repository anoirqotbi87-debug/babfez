const fs = require('fs');
const file = 'src/app/[lang]/page.tsx';
let page = fs.readFileSync(file, 'utf8');

function rep(regex, replacement) {
  if (page.match(regex)) {
    page = page.replace(regex, replacement);
  } else {
    console.log('Missed:', regex);
  }
}

// 1. Formulaire
rep(/Prêt à transformer votre bien en machine à cash \?/, "{lang === 'ar' ? \"جاهزون لمضاعفة أرباح عقاركم بفاس؟\" : \"Prêt à transformer votre bien en machine à cash ?\"}");
rep(/Laissez-nous vos coordonnées, un expert BABFEZ vous recontactera sous 24h pour une estimation gratuite\./, "{lang === 'ar' ? \"اتركوا لنا بياناتكم، وسيتواصل معكم خبير من باب فاس خلال 24 ساعة لتقديم دراسة مجانية.\" : \"Laissez-nous vos coordonnées, un expert BABFEZ vous recontactera sous 24h pour une estimation gratuite.\"}");

// 2. Simulateur
rep(/Cette estimation est basée sur nos données de marché à Fès et peut varier selon l'état du bien\./, "{lang === 'ar' ? \"هذا التقدير مبني على بيانات السوق بفاس وقد يختلف حسب حالة العقار وموقعه.\" : \"Cette estimation est basée sur nos données de marché à Fès et peut varier selon l'état du bien.\"}");

// 3. Avantages
rep(/>Pourquoi choisir BABFEZ \?</, ">{lang === 'ar' ? \"لماذا تختارون باب فاس؟\" : \"Pourquoi choisir BABFEZ ?\"}<");
rep(/>L'expertise locale alliée aux standards internationaux de l'hôtellerie\.</, ">{lang === 'ar' ? \"خبرة محلية أصيلة بمعايير فندقية دولية.\" : \"L'expertise locale alliée aux standards internationaux de l'hôtellerie.\"}<");
rep(/>Fiches de Police</, ">{lang === 'ar' ? \"استمارات الشرطة\" : \"Fiches de Police\"}<");
rep(/>Nous gérons à 100% l'obligation légale des fiches de police pour chaque voyageur auprès des autorités\.</, ">{lang === 'ar' ? \"نتكفل كلياً بالواجب القانوني لاستمارات الشرطة لكل مسافر لدى السلطات المختصة.\" : \"Nous gérons à 100% l'obligation légale des fiches de police pour chaque voyageur auprès des autorités.\"}<");
rep(/>Ménage Hôtelier</, ">{lang === 'ar' ? \"نظافة فندقية احترافية\" : \"Ménage Hôtelier\"}<");
rep(/>Une équipe de nettoyage professionnelle intervient après chaque départ\. Blanchisserie incluse\.</, ">{lang === 'ar' ? \"فريق نظافة محترف يتدخل بعد كل مغادرة مع غسيل وكي الشراشف بمعايير الفنادق.\" : \"Une équipe de nettoyage professionnelle intervient après chaque départ. Blanchisserie incluse.\"}<");
rep(/>Tarification Dynamique</, ">{lang === 'ar' ? \"تسعير يومي ذكي\" : \"Tarification Dynamique\"}<");
rep(/>Nos algorithmes ajustent vos prix chaque jour pour maximiser vos revenus selon la demande \(festivals, vacances\)\.</, ">{lang === 'ar' ? \"خوارزمياتنا تعدل الأسعار يومياً لرفع مداخيلكم حسب الطلب والمواسم السياحية.\" : \"Nos algorithmes ajustent vos prix chaque jour pour maximiser vos revenus selon la demande (festivals, vacances).\"}<");
rep(/>Accueil Physique</, ">{lang === 'ar' ? \"استقبال شخصي مباشر\" : \"Accueil Physique\"}<");
rep(/>Pas de boîte à clés impersonnelle\. Un concierge BABFEZ accueille vos voyageurs avec le sourire\.</, ">{lang === 'ar' ? \"لا نعتمد على الصناديق الباردة. فريق باب فاس يستقبل ضيوفكم بابتسامة وترحاب فاسي أصيل.\" : \"Pas de boîte à clés impersonnelle. Un concierge BABFEZ accueille vos voyageurs avec le sourire.\"}<");

// 4. FAQ
rep(/>Questions Fréquentes</, ">{lang === 'ar' ? \"الأسئلة الشائعة\" : \"Questions Fréquentes\"}<");
rep(/>Puis-je bloquer des dates pour moi-même \?</, ">{lang === 'ar' ? \"هل يمكنني حجز شقتي لإقامتي الشخصية؟\" : \"Puis-je bloquer des dates pour moi-même ?\"}<");
rep(/>Qui paie les frais de ménage \?</, ">{lang === 'ar' ? \"من يتحمل مصاريف النظافة؟\" : \"Qui paie les frais de ménage ?\"}<");
rep(/>Comment suivez-vous les revenus \?</, ">{lang === 'ar' ? \"كيف يمكنني متابعة أرباحي وحجوزاتي؟\" : \"Comment suivez-vous les revenus ?\"}<");

fs.writeFileSync(file, page);
