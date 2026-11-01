import React, { useState } from 'react';
import { Copy, Check, Terminal, Compass, Database } from 'lucide-react';
import { AngleMode, ThemeMode } from '../types';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  pythonSyntax: string;
  isError: boolean;
  theme: ThemeMode;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  hasMemory: boolean;
  ansValue?: number;
  onClear: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  pythonSyntax,
  isError,
  theme,
  angleMode,
  onToggleAngleMode,
  hasMemory,
  ansValue,
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const handleCopy = () => {
    const textToCopy = result || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const getResultFontSize = (text: string) => {
    const len = text.length;
    if (len > 24) return 'text-xl sm:text-2xl';
    if (len > 18) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 8) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div
      className={`relative w-full rounded-2xl p-4 sm:p-6 transition-all duration-200 border shadow-inner ${
        isDark
          ? 'bg-slate-950/70 border-slate-800/80 text-white'
          : 'bg-slate-50/90 border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Status Strip: Scientific Mode, Memory, Ans and Live Python */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-h-6 text-xs mb-3 pb-2 border-b border-slate-800/20 dark:border-slate-800/60">
        
        {/* Left: Scientific Badges */}
        <div className="flex items-center gap-2">
          {/* Angle Mode Badge (Interactive) */}
          <button
            onClick={onToggleAngleMode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold tracking-wider transition-all border ${
              angleMode === 'DEG'
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/25'
                : angleMode === 'RAD'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
            }`}
            title="Clique para alternar a unidade angular (DEG -> RAD -> GRAD)"
          >
            <Compass className="w-3 h-3" />
            <span>{angleMode}</span>
          </button>

          {/* Memory Active Indicator */}
          {hasMemory && (
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 animate-pulse"
              title="Valor armazenado na memória (MR / M+)"
            >
              <Database className="w-2.5 h-2.5" />
              M
            </span>
          )}

          {/* Ans Indicator */}
          {ansValue !== undefined && ansValue !== 0 && (
            <span
              className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md font-mono text-[10px] ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
              }`}
              title={`Último resultado Ans: ${ansValue}`}
            >
              Ans={ansValue}
            </span>
          )}
        </div>

        {/* Right: Python Expression & Copy button */}
        <div className="flex items-center gap-2 max-w-[60%] sm:max-w-[70%]">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span
              className={`font-mono text-xs truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
              title={pythonSyntax || 'python: 0'}
            >
              {pythonSyntax ? `>>> ${pythonSyntax}` : '>>> pronto'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`shrink-0 p-1.5 rounded-md text-xs transition-colors ${
              copied
                ? 'text-emerald-500 bg-emerald-500/10'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Copiar resultado"
            aria-label="Copiar resultado para a área de transferência"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Middle row: Active Formula / Expression */}
      <div
        className={`h-7 overflow-x-auto text-right font-mono text-sm sm:text-base tracking-wide select-all scrollbar-none transition-colors ${
          isDark ? 'text-indigo-300/80' : 'text-indigo-600/90'
        }`}
      >
        {expression || ' '}
      </div>

      {/* Main row: Value Display */}
      <div className="flex items-baseline justify-end gap-1 mt-1 overflow-x-hidden">
        <span
          className={`font-semibold font-mono tracking-tight tabular-nums select-all text-right break-all transition-all ${
            getResultFontSize(result || '0')
          } ${
            isError
              ? 'text-rose-500 font-bold'
              : isDark
                ? 'text-white'
                : 'text-slate-900'
          }`}
        >
          {result || '0'}
        </span>
      </div>
    </div>
  );
};
