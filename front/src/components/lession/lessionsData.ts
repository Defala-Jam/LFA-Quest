export const lessonsData = [
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
  }
]
