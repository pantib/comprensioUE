/**
 * RECURS EDUCATIU: LA UNIÓ EUROPEA (Cicle Superior de Primària - Llengua Catalana)
 * Bateria combinada de 10 preguntes:
 * - Preguntes tipus test (selecció múltiple amb 4 opcions)
 * - Preguntes d'escriure (resposta curta / construïda amb validació flexible)
 * Totes amb mecanisme de 2 intents (pista al 1r error) i explicacions detallades.
 */

const RECURS_DATA = {
  meta: {
    titol: "La Unió Europea: Una comunitat de pobles i ciutadans",
    nivell: "Cicle Superior d'Educació Primària (5è i 6è)",
    materia: "Llengua Catalana (Comprensió Lectora i Expressió Escrita)",
    decret: "Currículum d'Educació Bàsica - Decret 175/2022",
    objectiu: "Desenvolupar la competència lectora i d'expressió escrita a partir d'un text divulgatiu sobre la Unió Europea, combinant preguntes de selecció múltiple i preguntes d'escriptura amb retroacció formativa."
  },

  textLectura: {
    titol: "Descobrim la Unió Europea: Una comunitat de pobles i ciutadans",
    subtitol: "Text informatiu i divulgatiu per a la lectura comprensiva",
    seccions: [
      {
        id: "sec-1",
        titol: "1. Els orígens i el somni de la pau",
        icona: "🕊️",
        paragrafs: [
          "Després de les greus destrosses i el patiment provocats per la Segona Guerra Mundial, diversos líders europeus com Robert Schuman van comprendre que, per evitar nous enfrontaments, calia que els països veïns cooperessin estretament en lloc de competir o lluitar.",
          "El 9 de maig de 1950, Schuman va proposar posar en comú la producció de carbó i d'acer de França i Alemanya. Aquesta proposta històrica va ser el primer pas d'un camí que, mitjançant diversos tractats de col·laboració, acabaria creant l'actual Unió Europea (UE).",
          "Avui dia, la UE és una associació voluntària i democràtica formada per 27 països membres que han decidit compartir projectes comuns per assegurar la convivència pacífica, el progrés econòmic i el benestar de tota la ciutadania."
        ]
      },
      {
        id: "sec-2",
        titol: "2. Els símbols d'un projecte compartit",
        icona: "🇪🇺",
        paragrafs: [
          "Com qualsevol comunitat, la Unió Europea compta amb diversos símbols que expressen la seva identitat i els seus ideals.",
          "El lema oficial de la UE és «Units en la diversitat». Aquesta frase significa que els pobles europeus col·laboren junts per la pau i el benestar, però alhora mantenen i respecten les seves diverses tradicions, cultures i llengües pròpies, que consideren una gran riquesa.",
          "La bandera europea té un cercle de dotze estrelles daurades sobre un fons blau cel. El número dotze no indica la quantitat d'estats membres, sinó que és un símbol clàssic que representa la unitat, la plenitud i la perfecció.",
          "L'himne oficial és la melodia de l'«Oda a l'Alegria», creada pel compositor Ludwig van Beethoven en la seva Novena Simfonia. No té lletra, només música, perquè el seu missatge de fraternitat universal pugui ser compartit per tothom, parli la llengua que parli. A més, cada 9 de maig se celebra oficialment el Dia d'Europa."
        ]
      },
      {
        id: "sec-3",
        titol: "3. Com es prenen les decisions? Les institucions",
        icona: "🏛️",
        paragrafs: [
          "La Unió Europea no és un sol país ni un estat únic, sinó una organització en què els estats membres prenen acords conjunts a través de tres grans institucions democràtiques:",
          "• El Parlament Europeu: És la veu de la ciutadania. Està format pels eurodiputats i eurodiputades, que són escollits directament a les urnes per la població de cada país cada cinc anys. La seva tasca és debatre, millorar i aprovar les lleis i el pressupost europeu.",
          "• La Comissió Europea: Actua com el govern executiu de la UE. S'encarrega de proposar noves lleis i de vigilar que tots els estats compleixin correctament els acords signats.",
          "• El Consell de la Unió Europea: Format pels ministres de cada govern estatal, defensa els punts de vista de cada país i pren decisions conjuntament amb el Parlament."
        ]
      },
      {
        id: "sec-4",
        titol: "4. Els avantatges de ser ciutadà o ciutadana europea",
        icona: "🌍",
        paragrafs: [
          "Formar part de la Unió Europea atorga a la ciutadania un conjunt de drets i facilitats pràctiques molt importants per a la vida quotidiana.",
          "Un dels drets més coneguts és la lliure circulació de persones, gràcies a l'acord conegut com a Espai Schengen. Aquest acord permet viatjar, residir o treballar per la majoria de països de la UE sense haver de passar controls a les fronteres interiors ni haver de tramitar visats complicats.",
          "A més a més, 20 dels 27 països de la UE utilitzen una moneda comuna: l'euro (€). Això fa que viatjar, comprar o fer negocis entre països membres sigui molt senzill, ja que no cal canviar de diners a les cases de canvi.",
          "Un altre avantatge clau és el programa educatiu Erasmus+, que permet que estudiants i mestres puguin fer estades de formació a escoles i universitats d'altres estats, coneixent noves maneres d'aprendre i practicant altres llengües."
        ]
      },
      {
        id: "sec-5",
        titol: "5. Els valors fonamentals i els reptes de futur",
        icona: "🤝",
        paragrafs: [
          "La convivència a la Unió Europea es fonamenta en valors universals: la pau, la democràcia, la llibertat, la igualtat i el respecte per la dignitat i els drets humans.",
          "Entre aquests valors destaca la solidaritat: quan un país membre pateix una situació d'emergència, com ara inundacions, incendis forestals o crisis sanitàries, els altres països li envien ajuda immediata, material mèdic i equips especialitzats de salvament.",
          "De cara al futur, la UE treballa intensament en el Pacte Verd Europeu, un conjunt de mesures per frenar el canvi climàtic, reduir la contaminació i promoure energies netes per protegir la natura i deixar un planeta habitable a les pròximes generacions."
        ]
      }
    ]
  },

  glossari: [
    {
      terme: "Unió Europea (UE)",
      definicio: "Associació econòmica i política formada actualment per 27 països europeus democràtics que cooperen per a la pau, el progrés i el benestar de la ciutadania."
    },
    {
      terme: "Tractat",
      definicio: "Acord formal i legalment obligatori signat entre diferents països on s'estableixen normes, drets i deures compartits."
    },
    {
      terme: "Espai Schengen",
      definicio: "Àrea territorial formada per diversos països europeus on s'han eliminat els controls a les fronteres interiors, permetent la lliure circulació de persones."
    },
    {
      terme: "Euro (€)",
      definicio: "Moneda oficial compartida per la majoria dels països de la Unió Europea (anomenada zona euro o eurozona)."
    },
    {
      terme: "Parlament Europeu",
      definicio: "Institució democràtica de la UE escollida directament per la ciutadania cada cinc anys per aprovar lleis i pressupostos."
    },
    {
      terme: "Comissió Europea",
      definicio: "Òrgan de la UE que proposa noves lleis i vigila que els estats membres compleixin els tractats i les normatives."
    },
    {
      terme: "Erasmus+",
      definicio: "Programa de la Unió Europea que ofereix beques i ajuts a estudiants, docents i joves per formar-se a altres països europeus."
    },
    {
      terme: "Solidaritat",
      definicio: "Ajuda mútua i suport entre persones o comunitats en situacions de necessitat o dificultat."
    },
    {
      terme: "Diversitat",
      definicio: "Varietat de cultures, tradicions, idiomes i maneres de pensar que conviuen amb respecte mutu en una societat."
    },
    {
      terme: "Pacte Verd",
      definicio: "Pla de la Unió Europea per combatre el canvi climàtic i cuidar el medi ambient amb energies netes i sostenibles."
    }
  ],

  preguntes: [
    // 1. TEST (Literal)
    {
      id: 1,
      format: "test",
      tipus: "literal",
      tipusNom: "Comprensió Literal (Tipus Test)",
      enunciat: "Què simbolitza el nombre de 12 estrelles daurades a la bandera de la Unió Europea?",
      opcions: [
        { id: "a", text: "Que la Unió Europea té exactament dotze països membres actualment" },
        { id: "b", text: "Els dotze mesos de l'any durant els quals es reuneix el Parlament" },
        { id: "c", text: "La unitat, la plenitud i la perfecció" },
        { id: "d", text: "Les dotze primeres escoles que van participar en el programa Erasmus+" }
      ],
      respostaCorrecta: "c",
      pista: "💡 Pista pedagògica: Al paràgraf 2 s'explica que el nombre 12 no depèn de la quantitat de països, sinó d'un significat simbòlic tradicional.",
      explicacio: "A la bandera europea, el número 12 no fa referència al nombre d'estats (que actualment en són 27), sinó que és un símbol clàssic d'harmonia, plenitud, perfecció i unitat entre els pobles."
    },

    // 2. ESCRIURE (Literal)
    {
      id: 2,
      format: "escriure",
      tipus: "literal",
      tipusNom: "Comprensió Literal (Escriure la resposta)",
      enunciat: "Quin és el lema oficial de la Unió Europea? Escriu exactament la frase esmentada al text que comença per «Units...»:",
      placeholder: "Escriu aquí el lema oficial...",
      respostesAcceptades: [
        "units en la diversitat",
        "units a la diversitat"
      ],
      respostaModel: "Units en la diversitat",
      pista: "💡 Pista pedagògica: Revisa el paràgraf 2 («Els símbols d'un projecte compartit»). Són quatre paraules que expressen que treballem junts respectant les diferències («Units en la d...»).",
      explicacio: "El lema oficial de la Unió Europea és «Units en la diversitat». Aquesta frase resumeix que els pobles europeus col·laboren per la pau i el benestar tot preservant la riquesa de les seves llengües i tradicions."
    },

    // 3. TEST (Literal)
    {
      id: 3,
      format: "test",
      tipus: "literal",
      tipusNom: "Comprensió Literal (Tipus Test)",
      enunciat: "En quina data se celebra oficialment el Dia d'Europa en record de la proposta fundacional de Robert Schuman?",
      opcions: [
        { id: "a", text: "El 9 de maig" },
        { id: "b", text: "El 12 d'octubre" },
        { id: "c", text: "El 6 de desembre" },
        { id: "d", text: "L'1 de gener" }
      ],
      respostaCorrecta: "a",
      pista: "💡 Pista pedagògica: Consulta el final del paràgraf 2 o recorda la data fundacional esmentada al paràgraf 1 sobre la històrica declaració de 1950.",
      explicacio: "El Dia d'Europa se celebra cada 9 de maig perquè va ser exactament el 9 de maig de 1950 quan Robert Schuman va presentar la declaració que va donar origen a la construcció europea."
    },

    // 4. ESCRIURE (Literal)
    {
      id: 4,
      format: "escriure",
      tipus: "literal",
      tipusNom: "Comprensió Literal (Escriure la resposta)",
      enunciat: "Com s'anomena la moneda oficial compartida per 20 dels 27 països de la Unió Europea?",
      placeholder: "Escriu el nom de la moneda...",
      respostesAcceptades: [
        "euro",
        "l'euro",
        "leuro",
        "el euro",
        "euros"
      ],
      respostaModel: "L'euro (€)",
      pista: "💡 Pista pedagògica: Té només 4 lletres i comença per la lletra 'e'. Revisa el paràgraf 4 («Els avantatges de ser ciutadà o ciutadana europea»).",
      explicacio: "La moneda comuna és l'euro (€). Utilitzar una mateixa moneda facilita enormement viatjar, comerciar i comparar preus entre els països de la zona euro sense haver de canviar de divisa."
    },

    // 5. TEST (Literal)
    {
      id: 5,
      format: "test",
      tipus: "literal",
      tipusNom: "Comprensió Literal (Tipus Test)",
      enunciat: "Quina institució de la UE és escollida directament pel vot de la ciutadania a les eleccions cada cinc anys?",
      opcions: [
        { id: "a", text: "El Consell de la Unió Europea" },
        { id: "b", text: "La Comissió Europea" },
        { id: "c", text: "El Parlament Europeu" },
        { id: "d", text: "El Tribunal de Comptes Europeu" }
      ],
      respostaCorrecta: "c",
      pista: "💡 Pista pedagògica: Torna a llegir l'apartat 3 («Com es prenen les decisions?»). Busca quina institució està formada pels eurodiputats i eurodiputades votats a les urnes.",
      explicacio: "El Parlament Europeu és l'única institució comunitària els representants de la qual són escollits directament pel vot democràtic dels ciutadans europeus cada cinc anys."
    },

    // 6. ESCRIURE (Inferencial)
    {
      id: 6,
      format: "escriure",
      tipus: "inferencial",
      tipusNom: "Comprensió Inferencial (Escriure la resposta)",
      enunciat: "Quins dos recursos i materials industrials indispensables per a les armes van acordar posar en comú França i Alemanya el 1950 per assegurar la pau?",
      placeholder: "Escriu els dos materials (exemple: ... i ...)",
      respostesAcceptades: [
        "carbo i acer",
        "el carbo i l'acer",
        "el carbo i lacer",
        "el carbo i el acer",
        "acer i carbo",
        "l'acer i el carbo",
        "lacer i el carbo"
      ],
      respostaModel: "El carbó i l'acer",
      pista: "💡 Pista pedagògica: Revisa el paràgraf 1. Un és un combustible fòssil negre que s'extreia de les mines i l'altre és un metall resistent que es feia servir per fabricar armament i maquinària.",
      explicacio: "El carbó i l'acer eren la base de la indústria pesant i militar. En posar la seva producció sota una gestió compartida, cap dels dos països podia preparar una guerra d'amagat de l'altre, blindant així la pau europea."
    },

    // 7. TEST (Inferencial)
    {
      id: 7,
      format: "test",
      tipus: "inferencial",
      tipusNom: "Comprensió Inferencial (Tipus Test)",
      enunciat: "Segons el text, què permet l'Espai Schengen a les persones que viuen a la UE?",
      opcions: [
        { id: "a", text: "Viatjar i circular entre països membres sense controls a les fronteres interiors" },
        { id: "b", text: "Parlar una única llengua sense necessitat d'aprendre altres idiomes" },
        { id: "c", text: "Utilitzar transport públic de franc a qualsevol ciutat del món" },
        { id: "d", text: "Comprar productes estrangers sense haver de pagar mai cap moneda" }
      ],
      respostaCorrecta: "a",
      pista: "💡 Pista pedagògica: Revisa l'apartat 4 («Els avantatges de ser ciutadà o ciutadana europea») en el fragment on s'explica la lliure circulació de persones.",
      explicacio: "L'Espai Schengen suprimeix els controls a les fronteres interiors entre els estats signataris, fent possible viatjar, estudiar o establir-se en un altre país de la zona amb total llibertat i sense haver d'ensenyar el passaport constantment."
    },

    // 8. ESCRIURE (Inferencial)
    {
      id: 8,
      format: "escriure",
      tipus: "inferencial",
      tipusNom: "Comprensió Inferencial (Escriure la resposta)",
      enunciat: "Quin valor fonamental de la UE (esmentat al paràgraf 5) defineix l'ajuda mútua i enviament d'equips de salvament quan un país veí pateix una catàstrofe natural?",
      placeholder: "Escriu el nom d'aquest valor (una sola paraula)...",
      respostesAcceptades: [
        "solidaritat",
        "la solidaritat"
      ],
      respostaModel: "La solidaritat",
      pista: "💡 Pista pedagògica: És un substantiu femení que comença per 's' i expressa el deure de no deixar sol ningú davant d'una greu dificultat (incendis, inundacions...). Revisa el paràgraf 5.",
      explicacio: "La solidaritat és el principi fonamental que mou els països socis a compartir recursos, avions de bombers, personal mèdic i suport econòmic quan un membre travessa una situació d'emergència."
    },

    // 9. TEST (Inferencial)
    {
      id: 9,
      format: "test",
      tipus: "inferencial",
      tipusNom: "Comprensió Inferencial (Tipus Test)",
      enunciat: "La Laia, una mestra catalana, vol anar a formar-se durant un mes a una escola de Florència (Itàlia) i després visitar museus a França. Quins avantatges de la UE aprofitarà directament?",
      opcions: [
        { id: "a", text: "El programa Erasmus+, la llibertat de desplaçament de l'Espai Schengen i la utilització de l'euro sense canvi de moneda" },
        { id: "b", text: "La participació obligatòria a la Comissió Europea i el lliurament de carbó i acer gratuït" },
        { id: "c", text: "La prohibició de parlar italià a les escoles i l'obligació de cantar l'Oda a l'Alegria en entrar al tren" },
        { id: "d", text: "La necessitat de sol·licitar un visat i passar duanes a cada poble on vulgui aturar-se" }
      ],
      respostaCorrecta: "a",
      pista: "💡 Pista pedagògica: Relaciona els avantatges del paràgraf 4: beques d'estudi (Erasmus+), viatjar sense duanes (Schengen) i fer pagaments directes en la mateixa moneda (€).",
      explicacio: "Gràcies a la pertinença a la UE, una docent pot participar en beques Erasmus+, desplaçar-se lliurement per l'espai Schengen i utilitzar la mateixa moneda (euro) tant a Itàlia com a França."
    },

    // 10. TEST (Inferencial)
    {
      id: 10,
      format: "test",
      tipus: "inferencial",
      tipusNom: "Comprensió Inferencial (Tipus Test)",
      enunciat: "Per quina raó fonamental és essencial per a la democràcia que el Parlament Europeu sigui escollit pel vot popular?",
      opcions: [
        { id: "a", text: "Perquè garanteix que les lleis expressin la voluntat de la ciutadania i que les persones puguin exigir responsabilitats als seus representants" },
        { id: "b", text: "Perquè votar substitueix la necessitat que els països tinguin escoles i hospitals" },
        { id: "c", text: "Perquè així els governs mai no han de retre comptes de cap despesa" },
        { id: "d", text: "Perquè només poden votar les persones que viatgen sovint amb avió" }
      ],
      respostaCorrecta: "a",
      pista: "💡 Pista pedagògica: Reflexiona sobre la sobirania democràtica: qui té el poder de decisió i com la ciutadania fa sentir la seva veu a través del sufragi.",
      explicacio: "El vot popular directe connecta les institucions amb les persones. En triar els eurodiputats, la ciutadania assegura que les normatives reflecteixin les seves necessitats i protegeixin els seus drets."
    }
  ],

  guiaDocent: {
    competencies: [
      {
        nom: "Competència en comunicació lingüística (CCL)",
        descripcio: "Comprendre i interpretar textos escrits informatius i expressar idees i conceptes clau per escrit amb correcció i claredat."
      },
      {
        nom: "Competència ciutadana (CC)",
        descripcio: "Comprendre l'organització democràtica, els valors de pau, tolerància i solidaritat, i els drets de la ciutadania a la Unió Europea."
      },
      {
        nom: "Competència digital (CD)",
        descripcio: "Utilitzar aplicacions web educatives de manera autònoma, segura i respectuosa amb la protecció de dades personals."
      },
      {
        nom: "Competència personal, social i d'aprendre a aprendre (CPSAA)",
        descripcio: "Aprendre a partir de l'error mitjançant pistes pedagògiques reflexives, perseverant en la resolució de tasques i autoregulant el propi aprenentatge."
      }
    ],
    dua: [
      {
        principi: "Xarxes de reconeixement (El 'què' de l'aprenentatge)",
        accions: "Format multisuport: text estructurat amb iconografia, glossari interactiu desplegable de vocabulari clau, síntesi de veu (lectura en veu alta integrada) i visualitzador de lectura sempre accessible."
      },
      {
        principi: "Xarxes estratègiques (El 'com' de l'aprenentatge)",
        accions: "Combinació de tasques de reconeixement (tipus test) i d'evocació activa (preguntes d'escriure), navegabilitat 100% per teclat, opció de segon intent amb pista guiada i retroacció explicativa immediata."
      },
      {
        principi: "Xarxes afectives (El 'perquè' de l'aprenentatge)",
        accions: "Avaluació formativa no punitiva basada en la mentalitat de creixement; l'error és una oportunitat d'aprenentatge que ofereix una pista per reflexionar abans de donar el resultat."
      }
    ],
    transparenciaIA: {
      declaracio: "Aquest recurs educatiu ha estat dissenyat amb l'assistència de models d'Intel·ligència Artificial com a eina de prototipatge tecnològic i redacció inicial de plantilles de codi i activitats.",
      revisioDocent: "Tot el contingut textual, les preguntes pedagògiques (tant de test com d'escriptura), les respostes acceptades amb flexibilitat ortogràfica, les pistes de retroacció i els criteris d'accessibilitat han estat supervisats, adaptats i validats d'acord amb el currículum de Cicle Superior d'Educació Primària (Decret 175/2022) i les pautes de disseny DUA i WCAG 2.1 AA.",
      recomanacioAula: "Es recomana al docent fer una lectura prèvia compartida del text a l'aula o promoure el treball per parelles cooperatives per afavorir el diàleg reflexiu abans de respondre les preguntes inferencials i d'escriptura."
    }
  }
};
