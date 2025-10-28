// 📘 LessonData.ts — Banco de lições organizado por fases

import f1q1 from "./LessonDataImages/f1q1.jpeg";

// Fase 2
import f2q1 from "./LessonDataImages/f2q1.jpeg";
import f2q2 from "./LessonDataImages/f2q2.jpeg";
import f2q4 from "./LessonDataImages/f2q4.jpeg";


// =======================
// 🔹 FASE 1
// =======================

// Questão 1 – POSCOMP 2009
export const lesson_fase1_q1 = {
  title: "POSCOMP 2009 — Autômatos Finitos Não Determinísticos",
  
  explanation: `Partindo do estado inicial, um autômato aceita qualquer caminho que termine em um de seus estados de aceitação. 
Neste caso, começa em A e deve terminar em D.
Exemplo de notação: δ(A, x) = Y, lê-se "estando no estado A, lendo x, vai para Y".`,

  image: f1q1,

  question: "Considere o autômato finito não-determinístico a seguir. Qual conjunto de transições e estados de aceitação descreve corretamente esse autômato?",

  alternatives: [
    "Estado Inicial A, estados de aceitação C e D\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = D",
    "Estado Inicial A, estado de aceitação C\nδ(A, b) = B\nδ(B, a) = C\nδ(C, a) = C",
    "Estado Inicial A, estado de aceitação D\nδ(A, b) = B\nδ(B, a) = D\nδ(B, b) = C\nδ(C, a) = D",
    "Todas as respostas acima estão corretas."
  ],

  correctAnswer: 0,
};

// Questão 2 – POSCOMP 2009
export const lesson_fase1_q2 = {
  title: "POSCOMP 2009 — Gramática Regular",

  explanation: `Uma gramática regular gera palavras a partir do símbolo inicial. Cada produção mostra como um símbolo deriva uma sequência de símbolos terminais ou não-terminais.
Exemplo: S → ASb significa "S deriva ASb".`,

  question: "Com base nas regras de produção S → ASb | c e A → a, qual é a linguagem gerada por essa gramática?",

  alternatives: [
    "{aⁿcb | n ∈ ℕ}",
    "{acbⁿ | n ∈ ℕ}",
    "{aⁿcⁿb | n ∈ ℕ}",
    "{aⁿcbⁿ | n ∈ ℕ}"
  ],

  correctAnswer: 3,
};

// Questão 3 – POSCOMP 2012
export const lesson_fase1_q3 = {
  title: "POSCOMP 2012 — Conversão de AFN para AFD",

  explanation: `Ao converter um AFN em AFD, cada estado do AFD representa um subconjunto de estados do AFN. O número máximo de estados do AFD é 2^n, onde n é o número de estados do AFN.`,

  question: "Se um AFN tem 6 estados, qual é o número máximo de estados do AFD resultante, considerando os estados inúteis?",

  alternatives: ["12", "36", "64", "1024"],

  correctAnswer: 2,
};

// Questão 4 – POSCOMP 2013
export const lesson_fase1_q4 = {
  title: "POSCOMP 2013 — Cadeia Vazia e Estado Inicial",

  explanation: `Um autômato finito aceita qualquer palavra que termine em um de seus estados de aceitação. Se o estado inicial também for final, ele aceita a cadeia vazia.`,

  question: "Se o estado inicial de um autômato finito também for estado final, o que podemos afirmar sobre esse autômato?",

  alternatives: [
    "não aceita a cadeia vazia.",
    "não tem outros estados finais.",
    "é determinístico.",
    "aceita a cadeia vazia."
  ],

  correctAnswer: 3,
};

// Questão 5 – ENADE 2005
export const lesson_fase1_q5 = {
  title: "ENADE 2005 — Expressões Aritméticas e Gramáticas",

  explanation: `Para implementar um software que calcula expressões matemáticas simples respeitando precedência, é necessário definir corretamente as regras da gramática que descrevem as expressões e operadores.`,

  question: `Para que o software funcione corretamente, qual conjunto de definições de gramática o projetista deve usar?`,

  alternatives: [
    "defina I e II.",
    "defina III e IV.",
    "defina I, II e IV.",
    "defina I, III e IV."
  ],

  correctAnswer: 3,
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

  explanation: `Analise um autômato finito a partir das cadeias que ele reconhece ou rejeita. Os círculos em negrito representam estados de aceitação.`,

  image: f2q1,

  question: "Observando o autômato acima, qual das afirmativas sobre reconhecimento de palavras é FALSA?",

  alternatives: [
    "A palavra aaa é reconhecida pelo autômato.",
    "A palavra ababa não é reconhecida pelo autômato.",
    "A palavra vazia é reconhecida pelo autômato.",
    "A palavra aba é reconhecida pelo autômato."
  ],

  correctAnswer: 3,
};

// Questão 2 – UFG 2024 (adaptada)
export const lesson_fase2_q2 = {
  title: "UFG 2024 — Autômato JFLAP (Adaptado)",

  explanation: `Um autômato aceita ou rejeita palavras dependendo de suas transições e estados finais. Analise as transições para determinar quais cadeias são aceitas.`,

  image: f2q2,

  question: "Qual é a única cadeia de caracteres aceita pelo autômato mostrado acima?",

  alternatives: [
    "010000",
    "001011",
    "100110",
    "110101"
  ],

  correctAnswer: 3,
};

// Questão 3 – CESPE 2022
export const lesson_fase2_q3 = {
  title: "CESPE 2022 — Autômatos Determinísticos",

  explanation: `Autômatos determinísticos possuem exatamente uma transição para cada símbolo de entrada a partir de cada estado, enquanto autômatos não determinísticos podem ter múltiplas opções.`,

  question: "Sobre autômatos finitos determinísticos, qual das alternativas descreve corretamente seu comportamento?",

  alternatives: [
    "corresponde à função de transição que recebe um estado ou um símbolo de entrada que sempre retorna um conjunto de estados como resultado.",
    "tem a capacidade de adivinhar algo sobre sua entrada ao testar valores.",
    "pode, para cada entrada, transitar a partir do seu estado atual em um e somente um estado.",
    "permite zero, uma ou n transições para os estados de entrada."
  ],

  correctAnswer: 2,
};

// Questão 4 – POSCOMP 2022 (Adaptada)
export const lesson_fase2_q4 = {
  title: "POSCOMP 2022 — Linguagem Aceita por AFD",

  explanation: `Um AFD aceita um conjunto específico de palavras. A análise envolve entender o padrão das cadeias que passam pelo autômato e chegam a estados finais.`,

  image: f2q4,

  question: "Qual é a linguagem aceita pelo autômato determinístico mostrado acima?",

  alternatives: [
    "L = {awa: w ∈ {a,b}*}",
    "L = {w ∈ {a,b}* : |w a| = 1}",
    "L = {w ∈ {a,b}* : |w a| ≥ 0}",
    "L = {w ∈ {a,b}* : |w a| ≤ 3}"
  ],

  correctAnswer: 2,
};

// Questão 5 – ENADE 2008
export const lesson_fase2_q5 = {
  title: "ENADE 2008 — Tipos de Gramática",

  explanation: `Analise as regras de produção da gramática e sua classificação na hierarquia de Chomsky. Observe quais cadeias são geradas e se existe equivalência com gramática regular.`,

  question: "Considerando a gramática abaixo, qual afirmação correta podemos fazer sobre ela?\nS → AB\nAB → AAB\nA → a\nB → b",

  alternatives: [
    "A gramática G é ambígua.",
    "A gramática G é uma gramática livre de contexto.",
    "A cadeia aabbb é gerada por essa gramática.",
    "É possível encontrar uma gramática regular equivalente a G."
  ],

  correctAnswer: 3,
};

export const lessonsFase2 = [
  lesson_fase2_q1,
  lesson_fase2_q2,
  lesson_fase2_q3,
  lesson_fase2_q4,
  lesson_fase2_q5,
];