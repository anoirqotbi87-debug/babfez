const fs = require('fs');

function updatePage() {
  const file = 'src/app/[lang]/page.tsx';
  let page = fs.readFileSync(file, 'utf8');

  // 1
  page = page.replace(
    />Conciergerie & Intendance Privée</,
    `>{dict.nav?.subtitle || "Conciergerie & Intendance Privée"}<`
  );

  // 2
  page = page.replace(
    /Cette estimation est basée sur nos données de marché à Fès et peut varier selon l'état du bien\./,
    `{dict.simulator?.note || "Cette estimation est basée sur nos données de marché à Fès et peut varier selon l'état du bien."}`
  );

  // 3
  page = page.replace(
    />Pourquoi choisir BABFEZ \?</,
    `>{dict.advantages?.title || "Pourquoi choisir BABFEZ ?"}<`
  );
  page = page.replace(
    />Une expertise locale authentique avec des standards hôteliers internationaux\.</,
    `>{dict.advantages?.subtitle || "Une expertise locale authentique avec des standards hôteliers internationaux."}<`
  );
  page = page.replace(
    />Fiches de Police</,
    `>{dict.advantages?.f1Title || "Fiches de Police"}<`
  );
  page = page.replace(
    />Nous nous chargeons de l'obligation légale des fiches de police pour chaque voyageur auprès des autorités compétentes\.</,
    `>{dict.advantages?.f1Desc || "Nous nous chargeons de l'obligation légale des fiches de police pour chaque voyageur auprès des autorités compétentes."}<`
  );
  page = page.replace(
    />Ménage Hôtelier Pro</,
    `>{dict.advantages?.f2Title || "Ménage Hôtelier Pro"}<`
  );
  page = page.replace(
    />Une équipe de nettoyage professionnelle intervient après chaque départ, avec blanchisserie des draps aux standards hôteliers\.</,
    `>{dict.advantages?.f2Desc || "Une équipe de nettoyage professionnelle intervient après chaque départ, avec blanchisserie des draps aux standards hôteliers."}<`
  );
  page = page.replace(
    />Tarification Dynamique</,
    `>{dict.advantages?.f3Title || "Tarification Dynamique"}<`
  );
  page = page.replace(
    />Nos algorithmes ajustent vos prix au quotidien pour maximiser vos revenus selon la demande et la saisonnalité\.</,
    `>{dict.advantages?.f3Desc || "Nos algorithmes ajustent vos prix au quotidien pour maximiser vos revenus selon la demande et la saisonnalité."}<`
  );
  page = page.replace(
    />Accueil Physique & Chaleureux</,
    `>{dict.advantages?.f4Title || "Accueil Physique & Chaleureux"}<`
  );
  page = page.replace(
    />Fini les boîtes à clés froides\. Notre équipe accueille vos guests avec le sourire et l'hospitalité légendaire de Fès\.</,
    `>{dict.advantages?.f4Desc || "Fini les boîtes à clés froides. Notre équipe accueille vos guests avec le sourire et l'hospitalité légendaire de Fès."}<`
  );

  // 4
  page = page.replace(
    />Questions Fréquentes</g,
    `>{dict.faq?.title || "Questions Fréquentes"}<`
  );
  page = page.replace(
    />Tout ce que vous devez savoir sur la gestion avec BABFEZ\.</,
    `>{dict.faq?.subtitle || "Tout ce que vous devez savoir sur la gestion avec BABFEZ."}<`
  );
  page = page.replace(
    />Puis-je bloquer mon logement pour mon usage personnel \?</,
    `>{dict.faq?.q1 || "Puis-je bloquer mon logement pour mon usage personnel ?"}<`
  );
  page = page.replace(
    />Oui, tout à fait\. Vous gardez la liberté de bloquer les dates qui vous conviennent pour y passer vos vacances via votre Espace Propriétaire\.</,
    `>{dict.faq?.a1 || "Oui, tout à fait. Vous gardez la liberté de bloquer les dates qui vous conviennent pour y passer vos vacances via votre Espace Propriétaire."}<`
  );
  page = page.replace(
    />Qui paie les frais de ménage \?</,
    `>{dict.faq?.q2 || "Qui paie les frais de ménage ?"}<`
  );
  page = page.replace(
    />Ils sont à la charge directe du voyageur comme frais additionnels lors de la réservation, ils ne sont pas déduits de vos revenus\.</,
    `>{dict.faq?.a2 || "Ils sont à la charge directe du voyageur comme frais additionnels lors de la réservation, ils ne sont pas déduits de vos revenus."}<`
  );
  page = page.replace(
    />Comment puis-je suivre mes revenus et réservations \?</,
    `>{dict.faq?.q3 || "Comment puis-je suivre mes revenus et réservations ?"}<`
  );
  page = page.replace(
    />Via votre tableau de bord digital personnalisé qui affiche vos réservations et vos revenus en toute transparence\.</,
    `>{dict.faq?.a3 || "Via votre tableau de bord digital personnalisé qui affiche vos réservations et vos revenus en toute transparence."}<`
  );

  // 5
  page = page.replace(
    />Prêt à maximiser vos revenus locatifs à Fès \?</,
    `>{dict.contact?.heading || "Prêt à maximiser vos revenus locatifs à Fès ?"}<`
  );
  page = page.replace(
    />Laissez-nous vos coordonnées, un expert BABFEZ vous contactera sous 24h pour une étude gratuite\.</,
    `>{dict.contact?.subheading || "Laissez-nous vos coordonnées, un expert BABFEZ vous contactera sous 24h pour une étude gratuite."}<`
  );
  page = page.replace(
    />Gestion Sérénité \(20-25%\)</,
    `>{dict.contact?.planSerenite || "Gestion Sérénité (20-25%)"}<`
  );
  page = page.replace(
    />Gestion Digitale \(15%\)</,
    `>{dict.contact?.planDigital || "Gestion Digitale (15%)"}<`
  );
  page = page.replace(
    />Services à la carte</,
    `>{dict.contact?.planCustom || "Services à la carte"}<`
  );

  fs.writeFileSync(file, page);
}

updatePage();
