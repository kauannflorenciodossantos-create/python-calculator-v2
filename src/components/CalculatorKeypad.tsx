import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Delete, RotateCcw, Sparkles, BarChart3, Database } from 'lucide-react';
import { AngleMode, ThemeMode } from '../types';

interface CalculatorKeypadProps {
  theme: ThemeMode;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  isSecond: boolean;
  onToggleSecond: () => void;
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onDelete: () => void;
  onToggleSign: () => void;
  onParenthesis: (p: '(' | ')') => void;
  onComma: () => void;
  onFunction: (funcName: string) => void;
  onConstant: (constName: string) => void;
  onMemoryAction: (action: 'M+' | 'M-' | 'MR' | 'MC' | 'Ans' | 'STO' | 'RCL') => void;
  onEquals: () => void;
}

type ScientificTab = 'trig' | 'stats' | 'memory';

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  theme,
  angleMode,
  onToggleAngleMode,
  isSecond,
  onToggleSecond,
  onDigit,
  onOperator,
  onClear: _onClear,
  onAllClear,
  onDelete,
  onToggleSign,
  onParenthesis,
  onComma,
  onFunction,
  onConstant,
  onMemoryAction,
  onEquals,
}) => {
  const [activeTab, setActiveTab] = useState<ScientificTab>('trig');
  const isDark = theme === 'dark';

  const baseKeyClass =
    'relative flex items-center justify-center font-medium rounded-xl select-none transition-all duration-150 active:scale-95 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm cursor-pointer';

  const numKeyClass = `${baseKeyClass} h-11 sm:h-12 text-base sm:text-lg font-semibold ${
    isDark
      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/60'
      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200'
  }`;

  const opKeyClass = `${baseKeyClass} h-11 sm:h-12 font-mono font-semibold text-base sm:text-lg ${
    isDark
      ? 'bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50'
      : 'bg-indigo-50/90 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
  }`;

  const funcKeyClass = `${baseKeyClass} h-11 sm:h-12 text-xs sm:text-sm font-semibold ${
    isDark
      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
  }`;

  const sciKeyClass = `${baseKeyClass} h-10 sm:h-11 text-xs sm:text-sm font-mono font-semibold ${
    isDark
      ? 'bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/40'
      : 'bg-sky-50/90 hover:bg-sky-100 text-sky-700 border border-sky-200/80'
  }`;

  const equalsKeyClass = `${baseKeyClass} h-11 sm:h-12 font-bold text-xl ${
    'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
  }`;

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 mt-3">
      {/* Scientific Controls Header Strip */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-1">
        {/* Toggle 2nd / Shift */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSecond}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider border transition-all ${
            isSecond
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Alternar 2ª função (inversas e potências adicionais)"
        >
          2nd
        </motion.button>

        {/* Angle Mode Switcher */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAngleMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            isDark
              ? 'bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border-indigo-800/50'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
          }`}
          title="Alternar unidade angular: DEG (Graus) | RAD (Radianos) | GRAD (Grados)"
        >
          MODE: {angleMode}
        </motion.button>

        {/* Tabs for Scientific Sub-panels */}
        <div className="flex items-center gap-1 bg-slate-800/30 dark:bg-slate-900/60 p-0.5 rounded-lg border border-slate-700/40">
          <button
            onClick={() => setActiveTab('trig')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'trig'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-indigo-900 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Trig/Funções</span>
            <span className="sm:hidden">Trig</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'stats'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-indigo-900 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">Estatística</span>
            <span className="sm:hidden">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'memory'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-indigo-900 shadow-sm'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">Memória</span>
            <span className="sm:hidden">Mem</span>
          </button>
        </div>
      </div>

      {/* Dynamic Scientific Function Grid (5 Columns) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2 rounded-2xl bg-slate-950/20 dark:bg-slate-950/40 border border-slate-700/20 dark:border-slate-800/40">
        {activeTab === 'trig' && (
          <>
            {/* Row 1 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? 'asin' : 'sin')}
              className={sciKeyClass}
              title={isSecond ? 'Arco Seno (asin)' : 'Seno (sin)'}
            >
              {isSecond ? 'sin⁻¹' : 'sin'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? 'acos' : 'cos')}
              className={sciKeyClass}
              title={isSecond ? 'Arco Cosseno (acos)' : 'Cosseno (cos)'}
            >
              {isSecond ? 'cos⁻¹' : 'cos'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? 'atan' : 'tan')}
              className={sciKeyClass}
              title={isSecond ? 'Arco Tangente (atan)' : 'Tangente (tan)'}
            >
              {isSecond ? 'tan⁻¹' : 'tan'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onConstant('π')}
              className={sciKeyClass}
              title="Constante Pi (3.14159...)"
            >
              π
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onConstant('e')}
              className={sciKeyClass}
              title="Número de Euler (2.71828...)"
            >
              e
            </motion.button>

            {/* Row 2 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? 'exp' : 'ln')}
              className={sciKeyClass}
              title={isSecond ? 'Exponencial de base e (exp/eˣ)' : 'Logaritmo natural (ln)'}
            >
              {isSecond ? 'eˣ' : 'ln'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? '10^' : 'log')}
              className={sciKeyClass}
              title={isSecond ? 'Potência base 10 (10ˣ)' : 'Logaritmo base 10 (log10)'}
            >
              {isSecond ? '10ˣ' : 'log'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction(isSecond ? 'cbrt' : 'sqrt')}
              className={sciKeyClass}
              title={isSecond ? 'Raiz cúbica (∛x)' : 'Raiz quadrada (√x)'}
            >
              {isSecond ? '∛x' : '√x'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onOperator(isSecond ? 'sq' : '^')}
              className={sciKeyClass}
              title={isSecond ? 'Elevar ao quadrado (x²)' : 'Potência (xʸ)'}
            >
              {isSecond ? 'x²' : 'xʸ'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('factorial')}
              className={sciKeyClass}
              title="Fatorial (!)"
            >
              x!
            </motion.button>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            {/* Row 1: Statistics */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('mean')}
              className={sciKeyClass}
              title="Média aritmética: mean(10, 20, 30)"
            >
              mean
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('std')}
              className={sciKeyClass}
              title="Desvio padrão: std(x1, x2, ...)"
            >
              std
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('median')}
              className={sciKeyClass}
              title="Mediana: median(1, 5, 2, 8)"
            >
              med
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('sum')}
              className={sciKeyClass}
              title="Somatório: sum(1, 2, 3, 4)"
            >
              sum
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('var')}
              className={sciKeyClass}
              title="Variância amostral: var(x1, x2, ...)"
            >
              var
            </motion.button>

            {/* Row 2: Combinatorics and Advanced */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('nCr')}
              className={sciKeyClass}
              title="Combinações: nCr(n, r)"
            >
              nCr
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('nPr')}
              className={sciKeyClass}
              title="Arranjos / Permutações: nPr(n, r)"
            >
              nPr
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('sinh')}
              className={sciKeyClass}
              title="Seno hiperbólico: sinh(x)"
            >
              sinh
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('cosh')}
              className={sciKeyClass}
              title="Cosseno hiperbólico: cosh(x)"
            >
              cosh
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFunction('tanh')}
              className={sciKeyClass}
              title="Tangente hiperbólica: tanh(x)"
            >
              tanh
            </motion.button>
          </>
        )}

        {activeTab === 'memory' && (
          <>
            {/* Row 1: Memory Operations */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('Ans')}
              className={sciKeyClass}
              title="Último resultado (Ans)"
            >
              Ans
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('M+')}
              className={sciKeyClass}
              title="Adicionar à memória (M+)"
            >
              M+
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('M-')}
              className={sciKeyClass}
              title="Subtrair da memória (M-)"
            >
              M-
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('MR')}
              className={sciKeyClass}
              title="Resgatar memória (Memory Recall)"
            >
              MR
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('MC')}
              className={`${sciKeyClass} text-rose-400`}
              title="Limpar memória (Memory Clear)"
            >
              MC
            </motion.button>

            {/* Row 2: Variables STO & RCL */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('STO')}
              className={sciKeyClass}
              title="Armazenar em variável: STO A"
            >
              STO
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onMemoryAction('RCL')}
              className={sciKeyClass}
              title="Resgatar variável: RCL"
            >
              RCL
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onDigit('A')}
              className={sciKeyClass}
              title="Variável A"
            >
              A
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onDigit('B')}
              className={sciKeyClass}
              title="Variável B"
            >
              B
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onDigit('X')}
              className={sciKeyClass}
              title="Variável X"
            >
              X
            </motion.button>
          </>
        )}
      </div>

      {/* Main Standard Keypad Grid (4 Columns) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: Clear, Backspace, Parentheses, Division */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAllClear}
          className={`${funcKeyClass} ${isDark ? 'text-rose-400' : 'text-rose-600'}`}
          title="Limpar tudo (All Clear - Esc)"
        >
          AC
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className={funcKeyClass}
          title="Apagar dígito (Backspace)"
          aria-label="Apagar dígito"
        >
          <Delete className="w-5 h-5" />
        </motion.button>
        <div className="grid grid-cols-2 gap-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onParenthesis('(')}
            className={`${funcKeyClass} px-0`}
            title="Abre parênteses"
          >
            (
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onParenthesis(')')}
            className={`${funcKeyClass} px-0`}
            title="Fecha parênteses"
          >
            )
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('÷')}
          className={opKeyClass}
          title="Divisão (/)"
        >
          ÷
        </motion.button>

        {/* Row 2: 7, 8, 9, Multiplication */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('7')}
          className={numKeyClass}
        >
          7
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('8')}
          className={numKeyClass}
        >
          8
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('9')}
          className={numKeyClass}
        >
          9
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('×')}
          className={opKeyClass}
          title="Multiplicação (*)"
        >
          ×
        </motion.button>

        {/* Row 3: 4, 5, 6, Subtraction */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('4')}
          className={numKeyClass}
        >
          4
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('5')}
          className={numKeyClass}
        >
          5
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('6')}
          className={numKeyClass}
        >
          6
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('-')}
          className={opKeyClass}
          title="Subtração (-)"
        >
          -
        </motion.button>

        {/* Row 4: 1, 2, 3, Addition */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('1')}
          className={numKeyClass}
        >
          1
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('2')}
          className={numKeyClass}
        >
          2
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('3')}
          className={numKeyClass}
        >
          3
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('+')}
          className={opKeyClass}
          title="Adição (+)"
        >
          +
        </motion.button>

        {/* Row 5: Extra Scientific Helpers & Zero */}
        <div className="grid grid-cols-2 gap-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSign}
            className={`${funcKeyClass} px-0`}
            title="Inverter sinal (±)"
          >
            ±
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComma}
            className={`${funcKeyClass} px-0 font-mono font-bold`}
            title="Vírgula de argumentos: mean(1, 2)"
          >
            ,
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('0')}
          className={numKeyClass}
        >
          0
        </motion.button>

        <div className="grid grid-cols-2 gap-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDigit('.')}
            className={`${numKeyClass} px-0`}
            title="Ponto decimal (.)"
          >
            .
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFunction('EXP')}
            className={`${funcKeyClass} px-0 font-mono text-xs`}
            title="Notação Científica (×10ˣ / EE)"
          >
            EXP
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEquals}
          className={equalsKeyClass}
          title="Calcular resultado (Enter / =)"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};
