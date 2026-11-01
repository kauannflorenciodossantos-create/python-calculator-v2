# 🐍 PyCalc Studio — Calculadora Científica Moderna em Python

Uma evolução da calculadora básica presente em meu repositório anterior. Se trata de uma calculadora científica moderna, responsiva e de alta precisão que combina uma interface visual elegante em **Glassmorphism**, animações fluidas, efeitos sonoros sintetizados via **Web Audio API**, histórico lateral persistente, abas científicas integradas (Trigonometria, Estatística e Memória) e um **Terminal Python interativo em tempo real** impulsionado por código Python nativo (`calculator.py`) e **WebAssembly (Pyodide)** no navegador.

---

## ✨ Funcionalidades Principais

- 🔬 **Calculadora Científica Completa**:
  - **Funções Trigonométricas e Hiperbólicas**:
    - Seno (`sin`), Cosseno (`cos`), Tangente (`tan`).
    - Funções inversas (`sin⁻¹` / `asin`, `cos⁻¹` / `acos`, `tan⁻¹` / `atan`, `atan2`).
    - Funções hiperbólicas (`sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`).
  - **Modos de Unidade Angular (DEG / RAD / GRAD)**:
    - Alternância rápida com um clique no visor ou via comando CLI (`MODE DEG`, `MODE RAD`, `MODE GRAD`).
    - Conversão automática precisa para cálculos de trigonometria e física.
  - **Constantes e Símbolos Especiais**:
    - Acesso direto ao número $\pi$ (`pi`), número de Euler ($e$) e $\tau$ (`tau`).
    - Fatorial postfix (`5!`, `(3+2)!` ou `factorial(n)`).
    - Raiz quadrada (`√` / `sqrt`), raiz cúbica (`∛` / `cbrt`), potências (`xʸ` / `^`, `x²`, `x³`).
    - Logaritmos: Logaritmo natural (`ln`), logaritmo decimal (`log` / `log10`), logaritmo binário (`log2`) e exponencial (`exp` / `eˣ`).
  - **Hierarquia de Operações e Parênteses**:
    - Respeito integral à precedência matemática (PEMDAS/BODMAS) via AST (Árvore de Sintaxe Abstrata do Python).
    - Suporte a múltiplos níveis de parênteses aninhados: `((2 + 3) * (10 - 6)) / 4`.
    - **Multiplicação implícita inteligente**: suporta sintaxes naturais como `2pi`, `2(3 + 4)`, `(2)(5)` e `3sin(90)`.
  - **Memória e Variáveis (Ans, STO, RCL, M)**:
    - `Ans`: resgata instantaneamente o último resultado calculado para encadear contas.
    - `M+`, `M-`, `MR`, `MC`: operações clássicas de acumulador de memória com indicador visual `[M]` no display.
    - `STO` e `RCL`: armazenamento e resgate de variáveis (`A`, `B`, `C`, `X`, `Y`).
  - **Notação Científica e Estatística**:
    - Tecla `EXP` / `EE`: digitação prática de notação científica (ex: `1.5 EE 3` $\to$ `1.5e3` = `1500`).
    - Formatação automática de resultados para números muito grandes ($\ge 10^{12}$) ou muito pequenos ($< 10^{-6}$).
    - Funções estatísticas integradas: média aritmética (`mean`), desvio padrão amostral (`std`), mediana (`median`), somatório (`sum`), variância (`var`), combinações simples (`nCr` / `comb`) e arranjos (`nPr` / `perm`).

- 🔊 **Efeitos Sonoros Sintetizados**:
  - Áudio de latência zero gerado em tempo real via **Web Audio API** (sem arquivos externos pesados).
  - Tons senoidais distintos para números, pulsos para operadores e acordes harmônicos suaves ao pressionar o botão de igual (`=`).
  - Controle de volume com controle deslizante e botão de mudo com um clique.

- 💻 **Terminal Python em Tempo Real**:
  - Exibe a linha de código Python correspondente a cada operação em tempo real (`>>> resultado = sin(30) + 5!`).
  - Saída do console com medição de tempo de execução em milissegundos (`[exec: 0.35ms]`).
  - Campo de entrada interativo (REPL) para digitar qualquer expressão ou comando Python diretamente e executá-lo no motor.

- 📜 **Histórico Lateral Persistente**:
  - Registro de cálculos anteriores com data, hora, tempo de processamento e modo angular ativo (`[DEG]`, `[RAD]`, `[GRAD]`).
  - Um clique para copiar o resultado ou reinserir o valor na calculadora.
  - Opção para exportar os cálculos em arquivo `.txt` ou limpar todo o histórico.

- 🌓 **Modo Escuro e Modo Claro**:
  - Alternância de tema com transições suaves e persistência da preferência no navegador (`localStorage`).

- ⌨️ **Suporte a Teclado Físico**:
  - Atalhos completos: números (`0-9`), operadores (`+`, `-`, `*`, `/`, `%`, `^`), fatorial (`!`), vírgula (`,`), parênteses (`(`, `)`), constantes (`p` para $\pi$, `e` para Euler), cálculo (`Enter`, `=`), apagar (`Backspace`) e limpar (`Esc`).

- 📁 **Código Python Nativo Incluído**:
  - Módulo nativo `calculator.py` com CLI interativo e avaliação segura via árvore sintática abstrata (`ast`).
  - Suíte de **20 testes unitários automatizados** em `test_calculator.py`.

---

## 📂 Estrutura de Arquivos

```text
├── calculator.py              # Lógica central da calculadora científica em Python nativo (CLI & Classe)
├── test_calculator.py         # Suíte de 20 testes unitários automatizados em Python (unittest)
├── index.html                 # Ponto de entrada HTML com fontes e metatags
├── package.json               # Dependências do frontend e scripts de build
├── tsconfig.json              # Configurações do compilador TypeScript
├── vite.config.ts             # Configurações do Vite e Tailwind CSS
└── src/
    ├── main.tsx               # Inicialização da aplicação React
    ├── App.tsx                # Componente mestre e gerenciador de estados da calculadora científica
    ├── types.ts               # Tipagens TypeScript (cálculos, terminal, sons, temas e modos angulares)
    ├── index.css              # Estilos globais e tipografia (Plus Jakarta Sans & JetBrains Mono)
    ├── services/
    │   ├── pythonEngine.ts    # Motor de execução Python (Pyodide WebAssembly + avaliador científico local)
    │   └── soundService.ts    # Síntese sonora digital com Web Audio API
    └── components/
        ├── Navbar.tsx         # Barra de navegação com controles de áudio, tema e links
        ├── CalculatorDisplay.tsx # Visor de alta definição com badges de DEG/RAD/GRAD, Memória [M] e Ans
        ├── CalculatorKeypad.tsx  # Teclado científico com abas (Trig, Stats, Memória), 2nd e números
        ├── HistorySidebar.tsx    # Painel lateral de histórico com exportação e cópia
        ├── TerminalOutput.tsx    # Terminal interativo Python com streaming de logs e snippets rápidos
        └── PythonCodeModal.tsx   # Visualizador do código Python nativo na interface
```

---

## 🚀 Como Executar Localmente

### 1. Interface Web (Calculadora Científica com Terminal)

Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Estar dentro do diretório no qual os arquivos estão presentes 

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse a URL indicada no terminal (geralmente `http://localhost:3000`).

---

### 2. Motor Python via Linha de Comando (CLI)

Você também pode utilizar o arquivo `calculator.py` diretamente pelo terminal Python:

```bash
# Executar uma expressão científica diretamente
python3 calculator.py "sin(30) + 5! / 2"
python3 calculator.py "mean(10, 20, 30) * 2pi"

# Iniciar o modo interativo REPL no terminal
python3 calculator.py

# Executar a suíte de 20 testes unitários automatizados
python3 -m unittest test_calculator.py
```

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: Python 3.12 (`calculator.py`, `ast`, `math`, `operator`, `re`)
- **Frontend**: React 19 + TypeScript + Vite
- **Estilização**: Tailwind CSS v4 + Framer Motion
- **Áudio**: Web Audio API nativa (sem dependências de arquivos de som)
- **WebAssembly**: Pyodide CPython in-browser
- **Ícones**: Lucide React

---

## 📄 Licença

Este projeto é distribuído sob a **MIT License** (Ou Licença MIT)
