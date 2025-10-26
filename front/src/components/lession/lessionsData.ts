export const lessonsData = [
  //nó 1
  {
    id: 1,
    title: "Bubble Sort",
    questions: [
      {
        question: "Qual é o princípio básico do Bubble Sort?",
        alternatives: [
          "Trocar pares de elementos adjacentes fora de ordem",
          "Dividir o array em metades e mesclar",
          "Escolher um pivô e particionar",
          "Construir uma árvore de heap"
        ],
        correctAnswer: 0,
        explanation:
          "O Bubble Sort funciona trocando repetidamente pares de elementos adjacentes fora de ordem até que toda a lista esteja ordenada."
      },

      {
        question: "A complexidade de tempo média do Bubble Sort é:",
        alternatives: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation:
          "O Bubble Sort precisa comparar todos os pares adjacentes em múltiplas passagens, resultando em uma complexidade média de O(n²)."
      },
      {
        question: "O Bubble Sort é mais eficiente para:",
        alternatives: [
          "Grandes conjuntos de dados",
          "Pequenos conjuntos quase ordenados",
          "Dados aleatórios de tamanho infinito",
          "Processos em tempo real"
        ],
        correctAnswer: 1,
        explanation:
          "O Bubble Sort é simples, mas ineficiente em grandes volumes. É mais indicado para listas pequenas ou quase ordenadas."
      },
      {
        question: "O Bubble Sort realiza trocas até:",
        alternatives: [
          "O primeiro elemento estar correto",
          "Nenhuma troca ocorrer em uma passada",
          "O pivô estar na posição final",
          "Todos os elementos serem diferentes"
        ],
        correctAnswer: 1,
        explanation:
          "O algoritmo termina quando passa por todo o vetor sem realizar nenhuma troca, indicando que os elementos estão ordenados."
      },
      {
        question: "Quantas passagens o Bubble Sort realiza em um vetor de tamanho n?",
        alternatives: ["n", "n-1", "n/2", "log n"],
        correctAnswer: 1,
        explanation:
          "O Bubble Sort realiza n−1 passagens completas para garantir que todos os elementos estejam na posição correta."
      }
    ]
  },

  //nó 2
  {
    id: 2,
    title: "Insertion Sort",
    questions: [
      {
        question: "Qual é a ideia central do Insertion Sort?",
        alternatives: [
          "Dividir o vetor em metades e mesclar",
          "Inserir cada elemento na posição correta de uma parte já ordenada",
          "Trocar pares adjacentes fora de ordem",
          "Usar um pivô e particionar os elementos"
        ],
        correctAnswer: 1,
        explanation:
          "O Insertion Sort constrói uma parte ordenada do vetor e insere cada novo elemento na posição correta dentro dela."
      },
      {
        question: "A complexidade de tempo média do Insertion Sort é:",
        alternatives: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation:
          "No pior e no caso médio, o Insertion Sort realiza comparações e deslocamentos para cada elemento, resultando em O(n²)."
      },
      {
        question: "O Insertion Sort é mais eficiente para:",
        alternatives: [
          "Vetores grandes e aleatórios",
          "Vetores pequenos ou quase ordenados",
          "Vetores com muitos números iguais",
          "Processos paralelos"
        ],
        correctAnswer: 1,
        explanation:
          "O Insertion Sort é excelente para listas pequenas ou quase ordenadas, pois requer poucas movimentações nesses casos."
      },
      {
        question: "Durante a execução, o Insertion Sort compara o elemento atual com:",
        alternatives: [
          "Apenas o último elemento",
          "Todos os elementos anteriores até encontrar sua posição",
          "O primeiro e o último elemento",
          "O menor elemento do vetor"
        ],
        correctAnswer: 1,
        explanation:
          "Cada elemento é comparado com todos os anteriores até encontrar a posição correta para ser inserido."
      },
      {
        question: "O Insertion Sort é considerado um algoritmo:",
        alternatives: [
          "Instável e recursivo",
          "Estável e iterativo",
          "Recursivo e rápido",
          "Paralelo e não determinístico"
        ],
        correctAnswer: 1,
        explanation:
          "O Insertion Sort é um algoritmo estável (não muda a ordem de iguais) e iterativo, com implementação simples e direta."
      }
    ]
  },
  
  // questão 3 — Automato
  {
    id: 3,
    title: "Autômato: Reconhecendo 'ab'",
    questions: [
      {
        isAutomaton: true, // 🔹 Indica que é uma lição interativa
        question: "Construa um autômato que reconheça todas as cadeias que contêm a substring 'ab'.",
        correctAutomaton: {
          estados: [
            { id: 1, nome: "q0", isInicial: true, isFinal: false },
            { id: 2, nome: "q1", isInicial: false, isFinal: false },
            { id: 3, nome: "q2", isInicial: false, isFinal: true }
          ],
          conexoes: [
            { de: 1, para: 1, caractere: "b" },
            { de: 1, para: 2, caractere: "a" },
            { de: 2, para: 3, caractere: "b" },
            { de: 2, para: 2, caractere: "a" },
            { de: 3, para: 3, caractere: "a" },
            { de: 3, para: 3, caractere: "b" }
          ]
        },
        explanation: `
          O autômato deve reconhecer todas as cadeias que contenham o padrão 'ab'.
          - **q0** é o estado inicial, representando que ainda não encontramos um 'a'.
          - **q1** representa que já lemos um 'a'.
          - **q2** é o estado final, alcançado quando encontramos o padrão 'ab'.

          Transições:
          - De q0, lendo 'a' → vai para q1.
          - De q0, lendo 'b' → permanece em q0.
          - De q1, lendo 'a' → permanece em q1.
          - De q1, lendo 'b' → vai para q2 (achamos 'ab').
          - De q2, lendo 'a' ou 'b' → permanece em q2.
        `
      }
    ]
  }

]
