import React, { useState } from 'react';
import { History, Trash2, Copy, Check, CornerDownLeft, Download } from 'lucide-react';
import { CalculationRecord, ThemeMode } from '../types';

interface HistorySidebarProps {
  history: CalculationRecord[];
  theme: ThemeMode;
  onClearHistory: () => void;
  onSelectResult: (result: string) => void;
  onSelectExpression: (expr: string) => void;
  onClose?: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  theme,
  onClearHistory,
  onSelectResult,
  onSelectExpression,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const content = history
      .map(
        (item) =>
          `[${new Date(item.timestamp).toLocaleTimeString()}] ${item.pythonCode} = ${item.result} (${item.executionTimeMs}ms)`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pycalc_historico_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      className={`h-full flex flex-col rounded-2xl border transition-colors duration-200 overflow-hidden ${
        isDark
          ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-xl'
          : 'bg-white/80 border-slate-200/90 backdrop-blur-xl shadow-sm'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between gap-2 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <History className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2
            className={`text-sm font-semibold tracking-tight ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            Histórico Recente
          </h2>
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Exportar histórico em texto"
              aria-label="Exportar histórico"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearHistory}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/30'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title="Limpar histórico"
              aria-label="Limpar histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <History className="w-5 h-5" />
            </div>
            <p
              className={`text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Nenhum cálculo recente
            </p>
            <p
              className={`text-[11px] mt-1 max-w-[200px] ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Realize operações na calculadora para registrá-las aqui.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`group p-3 rounded-xl border transition-all duration-150 ${
                isDark
                  ? 'bg-slate-950/40 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-800/30'
                  : 'bg-slate-50/80 border-slate-200/80 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              {/* Metadata line without pill clutter */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span className="flex items-center gap-1.5">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-400">{item.executionTimeMs}ms</span>
                  {item.angleMode && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400/90 font-bold text-[10px]">{item.angleMode}</span>
                    </>
                  )}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(item.id, item.result)}
                    className="p-1 rounded hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400"
                    title="Copiar resultado"
                    aria-label="Copiar resultado"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onSelectResult(item.result)}
                    className="p-1 rounded hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400"
                    title="Inserir resultado na calculadora"
                    aria-label="Inserir resultado"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expression */}
              <button
                onClick={() => onSelectExpression(item.expression)}
                className={`w-full text-left font-mono text-xs truncate transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Clique para reutilizar a expressão"
              >
                {item.expression} =
              </button>

              {/* Result */}
              <div
                onClick={() => onSelectResult(item.result)}
                className={`w-full text-right font-mono text-base font-semibold tracking-tight tabular-nums cursor-pointer transition-colors ${
                  isDark ? 'text-indigo-300 group-hover:text-indigo-200' : 'text-indigo-600 group-hover:text-indigo-700'
                }`}
                title="Clique para usar este resultado"
              >
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
