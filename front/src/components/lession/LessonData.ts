// 📘 LessonData.ts — Banco de lições organizado por fases

// =======================
// 🔹 FASE 1
// =======================

// Questão 1 – POSCOMP 2009
export const lesson_fase1_q1 = {
  title: "POSCOMP 2009 — Autômatos Finitos Não Determinísticos",
  explanation: `Partindo do estado inicial, um autômato aceita qualquer caminho que termine em um de seus estados de aceitação. 
Neste caso, começa em A e deve terminar em D.

Exemplo de notação: δ(A, x) = Y, lê-se "estando no estado A, lendo x, vai para Y".`,

  question: "Considere o autômato finito não-determinístico a seguir, sendo A o estado inicial e D o único estado de aceitação.",

  alternatives: [
    "Estado Inicial A, estados de aceitação C e D\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = D",
    "Estado Inicial A, estado de aceitação C\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = C",
    "Estado Inicial A, estado de aceitação D\nδ(A, b) = B\nδ(B, a) = D\nδ(B, b) = C\nδ(C, a) = D",
    "Todas as respostas acima estão corretas.",
    "É impossível converter esse autômato finito não determinístico em um autômato finito determinístico."
  ],

  correctAnswer: 0,

  // difficulty: "médio",
  // tags: ["AFNDs", "percorrer caminhos", "AFND sem lambda no inicial"]
};

// Questão 2 – POSCOMP 2009
export const lesson_fase1_q2 = {
  title: "POSCOMP 2009 — Gramática Regular",
  explanation: `Partindo do símbolo inicial (neste caso S) forma-se uma palavra resultante da gramática, dependendo do caminho percorrido.
Quando um símbolo segue por um determinado caminho, diz-se que ele derivou o caminho resultante.
Exemplo: S → ASb lê-se "S deriva ASb".`,

  question: "Qual é a linguagem da gramática com as seguintes regras de produção?\nS → ASb | c\nA → a",

  alternatives: [
    "{aⁿcb | n ∈ ℕ}",
    "{acbⁿ | n ∈ ℕ}",
    "{aⁿcⁿb | n ∈ ℕ}",
    "{aⁿcbⁿ | n ∈ ℕ}",
    "Nenhuma das respostas anteriores"
  ],

  correctAnswer: 3,

  // difficulty: "fácil",
  // tags: ["Gramática Regular", "Derivações"]
};

// Questão 3 – POSCOMP 2012
export const lesson_fase1_q3 = {
  title: "POSCOMP 2012 — Conversão de AFN para AFD",
  explanation: `A quantidade máxima de estados de um AFD resultante segue a fórmula 2^n, onde n é o número de estados do AFN.`,

  question: "Seja um Autômato Finito Não Determinístico (AFN) com 6 estados. Aplicando-se o algoritmo de conversão de um AFN para um Autômato Finito Determinístico (AFD), em quantos estados, no máximo, resultaria o AFD considerando-se os estados inúteis?",

  alternatives: ["12", "36", "64", "1024", "46656"],

  correctAnswer: 2,

  // difficulty: "fácil",
  // tags: ["AFNDs", "Propriedade dos Autômatos"]
};

// Questão 4 – POSCOMP 2013
export const lesson_fase1_q4 = {
  title: "POSCOMP 2013 — Cadeia Vazia e Estado Inicial",
  explanation: `Um autômato aceita qualquer palavra que termine em um de seus estados de aceitação, mesmo que este seja o próprio estado inicial.`,

  question: "Se o estado inicial for também estado final em um autômato finito, então esse autômato:",

  alternatives: [
    "não aceita a cadeia vazia.",
    "não tem outros estados finais.",
    "é determinístico.",
    "aceita a cadeia vazia.",
    "é não determinístico."
  ],

  correctAnswer: 3,

  // difficulty: "fácil",
  // tags: ["AFDs", "Propriedades dos Autômatos", "Análise de Palavras"]
};

// Questão 5 – ENADE 2005
export const lesson_fase1_q5 = {
  title: "ENADE 2005 — Expressões Aritméticas e Gramáticas",
  explanation: `O problema envolve identificar o tipo correto de gramática para expressões aritméticas com regras de precedência.`,

  question: `Considere a necessidade de se implementar um componente de software que realiza cálculos de expressões matemáticas simples para as operações básicas. 
O software deve respeitar a precedência dos operadores. Para obter o referido software, é correto que o projetista:`,

  alternatives: [
    "defina I e II.",
    "defina III e IV.",
    "defina I, II e IV.",
    "defina I, III e IV.",
    "defina II, III e IV."
  ],

  correctAnswer: 3,

  // difficulty: "difícil",
  // tags: ["Gramática Regular", "Propriedades de Gramática", "Hierarquia de Chomsky"]
};

export const lessonsFase1 = [
  lesson_fase1_q1,
  lesson_fase1_q2,
  lesson_fase1_q3,
  lesson_fase1_q4,
  lesson_fase1_q5,
];

// =======================
// 🔹 FASE 2
// =======================

// Questão 1 – POSCOMP 2008
export const lesson_fase2_q1 = {
  title: "POSCOMP 2008 — Autômatos e Cadeias Reconhecidas",
  explanation: `Análise de um autômato finito a partir das cadeias que ele reconhece e rejeita.`,

  question: "Considere o autômato finito mostrado na figura abaixo (os círculos em negrito representam estados de aceitação). A esse respeito, assinale a afirmativa FALSA.",

  alternatives: [
    "A palavra aaa é reconhecida pelo autômato.",
    "A palavra ababa não é reconhecida pelo autômato.",
    "A palavra vazia é reconhecida pelo autômato.",
    "A palavra aba é reconhecida pelo autômato.",
    "A palavra baba é reconhecida pelo autômato."
  ],

  correctAnswer: 3,

  // difficulty: "médio",
  // tags: ["AFNDs", "Percorrer Caminhos", "AFND com λ no inicial"]
};

// Questão 2 – UFG 2024 (adaptada)
export const lesson_fase2_q2 = {
  title: "UFG 2024 — Autômato JFLAP (Adaptado)",
  explanation: `Analise o autômato e determine qual cadeia é aceita a partir de suas transições.`,

  question: "A única cadeia de caracteres aceita pelo autômato acima é:",

  alternatives: [
    "010000",
    "001011",
    "100110",
    "110101",
    "111000"
  ],

  correctAnswer: 3,

  // difficulty: "fácil",
  // tags: ["AFNDs", "Percorrer Caminhos", "AFND sem λ no inicial"]
};

// Questão 3 – CESPE 2022
export const lesson_fase2_q3 = {
  title: "CESPE 2022 — Autômatos Determinísticos",
  explanation: `Diferenças fundamentais entre autômatos determinísticos e não determinísticos.`,

  question: "O autômato finito determinístico:",

  alternatives: [
    "corresponde à função de transição que recebe um estado ou um símbolo de entrada que sempre retorna um conjunto de estados como resultado.",
    "tem a capacidade de adivinhar algo sobre sua entrada ao testar valores.",
    "pode, para cada entrada, transitar a partir do seu estado atual em um e somente um estado.",
    "permite zero, uma ou n transições para os estados de entrada.",
    "consegue estar em vários estados ao mesmo tempo."
  ],

  correctAnswer: 2,

  // difficulty: "fácil",
  // tags: ["AFDs", "Propriedades dos Autômatos"]
};

// Questão 4 – POSCOMP 2022 (Adaptada)
export const lesson_fase2_q4 = {
  title: "POSCOMP 2022 — Linguagem Aceita por AFD",
  explanation: `Análise do conjunto de palavras aceitas por um autômato determinístico.`,

  question: "Qual é a linguagem aceita pelo Autômato Finito Determinístico a seguir?",

  alternatives: [
    "L = {awa: w ∈ {a,b}*}",
    "L = {w ∈ {a,b}* : |w a| = 1}",
    "L = {w ∈ {a,b}* : |w a| ≥ 0}",
    "L = {w ∈ {a,b}* : |w a| ≤ 3}",
    "L = {w ∈ {a,b}* : |w a| é par e |w b| ≤ 3}"
  ],

  correctAnswer: 2,

  // difficulty: "médio",
  // tags: ["AFDs", "Percorrer Caminhos"]
};

// Questão 5 – ENADE 2008
export const lesson_fase2_q5 = {
  title: "ENADE 2008 — Tipos de Gramática",
  explanation: `Análise de regras de produção e classificação da gramática segundo a hierarquia de Chomsky.`,

  question: `Considere a gramática G definida pelas seguintes regras de produção:
S → AB
AB → AAB
A → a
B → b
Com relação a essa gramática, é correto afirmar que:`,

  alternatives: [
    "A gramática G é ambígua.",
    "A gramática G é uma gramática livre de contexto.",
    "A cadeia aabbb é gerada por essa gramática.",
    "É possível encontrar uma gramática regular equivalente a G.",
    "A gramática G gera a cadeia nula."
  ],

  correctAnswer: 3,

  // difficulty: "médio",
  // tags: ["Gramática Regular", "Derivações", "Propriedades das Gramáticas"]
};

export const lessonsFase2 = [
  lesson_fase2_q1,
  lesson_fase2_q2,
  lesson_fase2_q3,
  lesson_fase2_q4,
  lesson_fase2_q5,
];
