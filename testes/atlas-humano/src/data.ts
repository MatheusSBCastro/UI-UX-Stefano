export const SYSTEMS: Record<string, {
  name: string;
  shortName: string;
  color: string;
  lines: [string, string, string];
  source: { label: string; url: string };
}> = {
  digestive: {
    name: 'Sistema digestivo', shortName: 'Digestivo', color: '#c48a57',
    lines: ['Transforma os alimentos em nutrientes que o corpo consegue absorver.', 'Estômago, intestinos, fígado e pâncreas trabalham em conjunto.', 'Os resíduos seguem pelo intestino grosso até a eliminação.'],
    source: { label: 'NIDDK · Digestão', url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works' },
  },
  respiratory: {
    name: 'Sistema respiratório', shortName: 'Respiratório', color: '#719fa0',
    lines: ['As vias respiratórias conduzem o ar até os pulmões.', 'Nos alvéolos, o oxigênio passa para o sangue e o gás carbônico faz o caminho inverso.', 'O diafragma e os músculos do tórax ajudam a movimentar o ar.'],
    source: { label: 'NHLBI · Respiração', url: 'https://www.nhlbi.nih.gov/health/lungs' },
  },
  circulatory: {
    name: 'Sistema circulatório', shortName: 'Circulatório', color: '#bd6459',
    lines: ['O coração impulsiona o sangue pelos vasos sanguíneos.', 'Essa circulação entrega oxigênio e nutrientes aos tecidos.', 'Também transporta gás carbônico aos pulmões e resíduos aos órgãos que os eliminam.'],
    source: { label: 'NHLBI · Coração', url: 'https://www.nhlbi.nih.gov/health/heart' },
  },
  nervous: {
    name: 'Sistema nervoso', shortName: 'Nervoso', color: '#c9a84f',
    lines: ['Encéfalo, medula espinal e nervos trocam sinais pelo corpo.', 'Esses sinais participam dos sentidos, pensamentos e movimentos.', 'O sistema também coordena funções automáticas, como a respiração.'],
    source: { label: 'NICHD · Sistema nervoso', url: 'https://www.nichd.nih.gov/health/topics/factsheets/neuro' },
  },
  urinary: {
    name: 'Sistema urinário', shortName: 'Urinário', color: '#9f7968',
    lines: ['Os rins filtram o sangue e formam a urina.', 'Os ureteres levam a urina até a bexiga, onde ela fica armazenada.', 'A saída pela uretra elimina resíduos e o excesso de água.'],
    source: { label: 'NIDDK · Trato urinário', url: 'https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-tract-how-it-works' },
  },
  endocrine: {
    name: 'Sistema endócrino', shortName: 'Endócrino', color: '#b29769',
    lines: ['As glândulas endócrinas liberam hormônios na circulação.', 'Esses mensageiros ajudam a regular o metabolismo, o crescimento e a reprodução.', 'Tireoide, pâncreas e ovários estão entre os órgãos que produzem hormônios.'],
    source: { label: 'MedlinePlus · Hormônios', url: 'https://medlineplus.gov/hormones.html' },
  },
  lymphatic: {
    name: 'Sistema linfático', shortName: 'Linfático', color: '#82996a',
    lines: ['Vasos linfáticos transportam a linfa e ajudam no equilíbrio dos líquidos.', 'Linfonodos e baço participam da defesa contra microrganismos.', 'As células de defesa circulam e atuam nessa rede de tecidos e órgãos.'],
    source: { label: 'MedlinePlus · Sistema linfático', url: 'https://medlineplus.gov/lymphaticdiseases.html' },
  },
  reproductive: {
    name: 'Sistema reprodutor feminino', shortName: 'Reprodutor', color: '#a57b92',
    lines: ['Os ovários liberam ovócitos e produzem hormônios sexuais.', 'O útero oferece o ambiente para o desenvolvimento de uma gestação.', 'Os hormônios coordenam as mudanças do ciclo menstrual.'],
    source: { label: 'NICHD · Ciclo menstrual', url: 'https://www.nichd.nih.gov/health/topics/factsheets/menstruation' },
  },
};

export const ORGANS: {
  id: string;
  name: string;
  latin: string;
  system: string;
  summary: string;
  location: string;
  function: string;
}[] = [
  { id: 'brain', name: 'Cérebro', latin: 'Cerebrum', system: 'nervous', summary: 'Integra informações e participa do pensamento, da memória e dos movimentos.', location: 'Dentro do crânio.', function: 'Processar informações e coordenar respostas.' },
  { id: 'thyroid', name: 'Tireoide', latin: 'Glandula thyroidea', system: 'endocrine', summary: 'Produz hormônios que regulam o uso de energia pelo organismo.', location: 'Parte anterior do pescoço.', function: 'Regular o metabolismo por meio de hormônios.' },
  { id: 'trachea', name: 'Traqueia', latin: 'Trachea', system: 'respiratory', summary: 'Conduz o ar da laringe aos brônquios.', location: 'Do pescoço à parte superior do tórax.', function: 'Oferecer uma passagem para o ar.' },
  { id: 'lungs', name: 'Pulmões', latin: 'Pulmones', system: 'respiratory', summary: 'Realizam a troca de oxigênio e gás carbônico entre o ar e o sangue.', location: 'No tórax, um de cada lado do coração.', function: 'Realizar as trocas gasosas nos alvéolos.' },
  { id: 'heart', name: 'Coração', latin: 'Cor', system: 'circulatory', summary: 'Contrai-se para impulsionar o sangue pelo corpo e pelos pulmões.', location: 'Entre os pulmões, com maior parte à esquerda.', function: 'Manter a circulação sanguínea.' },
  { id: 'esophagus', name: 'Esôfago', latin: 'Oesophagus', system: 'digestive', summary: 'Transporta o alimento até o estômago por contrações musculares.', location: 'Atrás da traqueia, atravessando o tórax.', function: 'Conduzir o alimento deglutido.' },
  { id: 'liver', name: 'Fígado', latin: 'Hepar', system: 'digestive', summary: 'Processa nutrientes e produz a bile que auxilia na digestão.', location: 'Abdome superior, principalmente à direita.', function: 'Processar nutrientes e produzir bile.' },
  { id: 'gallbladder', name: 'Vesícula biliar', latin: 'Vesica biliaris', system: 'digestive', summary: 'Armazena a bile e a libera no intestino delgado.', location: 'Sob o fígado.', function: 'Disponibilizar bile para a digestão de gorduras.' },
  { id: 'stomach', name: 'Estômago', latin: 'Gaster', system: 'digestive', summary: 'Mistura o alimento com ácido e enzimas digestivas.', location: 'Abdome superior, predominantemente à esquerda.', function: 'Misturar e digerir o alimento.' },
  { id: 'pancreas', name: 'Pâncreas', latin: 'Pancreas', system: 'digestive', summary: 'Produz enzimas digestivas e hormônios, como a insulina.', location: 'Atrás do estômago, próximo ao duodeno.', function: 'Ajudar na digestão e no controle da glicose.' },
  { id: 'spleen', name: 'Baço', latin: 'Splen', system: 'lymphatic', summary: 'Participa da defesa imunológica e remove células sanguíneas envelhecidas.', location: 'Abdome superior esquerdo, sob as costelas.', function: 'Filtrar o sangue e apoiar a defesa do corpo.' },
  { id: 'small-intestine', name: 'Intestino delgado', latin: 'Intestinum tenue', system: 'digestive', summary: 'Completa a digestão e absorve a maior parte dos nutrientes.', location: 'Região central do abdome.', function: 'Digerir e absorver nutrientes.' },
  { id: 'large-intestine', name: 'Intestino grosso', latin: 'Intestinum crassum', system: 'digestive', summary: 'Absorve água e transforma os resíduos em fezes.', location: 'Contorna as alças do intestino delgado.', function: 'Absorver água e conduzir as fezes.' },
  { id: 'kidneys', name: 'Rins', latin: 'Renes', system: 'urinary', summary: 'Filtram o sangue, removem resíduos e regulam a quantidade de água.', location: 'Atrás do abdome, ao lado da coluna.', function: 'Formar a urina e equilibrar os líquidos.' },
  { id: 'bladder', name: 'Bexiga', latin: 'Vesica urinaria', system: 'urinary', summary: 'Armazena a urina até sua eliminação pela uretra.', location: 'Na pelve, atrás do osso púbico.', function: 'Armazenar e expulsar a urina.' },
  { id: 'uterus', name: 'Útero', latin: 'Uterus', system: 'reproductive', summary: 'Órgão muscular onde uma gestação pode se desenvolver.', location: 'Na pelve, entre a bexiga e o reto.', function: 'Acolher o desenvolvimento da gestação.' },
  { id: 'ovaries', name: 'Ovários', latin: 'Ovaria', system: 'reproductive', summary: 'Contêm ovócitos e produzem hormônios como estrogênio e progesterona.', location: 'Na pelve, um de cada lado do útero.', function: 'Liberar ovócitos e produzir hormônios.' },
];

export type Organ = (typeof ORGANS)[number];
