import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, Maximize2, Minimize2, Check, ArrowRight } from 'lucide-react';
import { TerminalLog, ThemeMode } from '../types';

interface TerminalOutputProps {
  logs: TerminalLog[];
  theme: ThemeMode;
  onClearLogs: () => void;
  onExecutePythonCommand: (cmd: string) => void;
  pyodideStatus: { isReady: boolean; isLoading: boolean; mode: 'pyodide' | 'local_python' };
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  logs,
  theme,
  onClearLogs,
  onExecutePythonCommand,
  pyodideStatus,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  // Auto scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onExecutePythonCommand(commandInput.trim());
    setCommandInput('');
  };

  const handleCopyLogs = () => {
    if (logs.length === 0) return;
    const fullLog = logs
      .map((l) => `${l.type === 'input' ? '>>> ' : ''}${l.text}`)
      .join('\n');
    navigator.clipboard.writeText(fullLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const quickSnippets = [
    'sin(30)',
    '5!',
    'mean(10, 25, 40)',
    'std(2, 4, 4, 4, 5, 5, 7, 9)',
    'nCr(10, 3)',
    '1.5e3 * 2',
    'MODE RAD',
    'Ans + 100',
  ];

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden font-mono text-xs ${
        isExpanded ? 'h-96' : 'h-64 sm:h-72'
      } ${
        isDark
          ? 'bg-slate-950/90 border-slate-800 text-slate-200 shadow-xl'
          : 'bg-slate-900 border-slate-700 text-slate-100 shadow-md'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="h-10 px-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Left: Window dots & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300 text-xs tracking-wide">
              Terminal Python 3.12 (Live Output)
            </span>
            <span className="text-[10px] text-emerald-400/90 hidden sm:inline">
              · {pyodideStatus.isReady ? 'Pyodide WebAssembly' : 'Motor Python Local Ativo'}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copiar saída do terminal"
            aria-label="Copiar logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Limpar terminal"
            aria-label="Limpar terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Reduzir terminal' : 'Expandir terminal'}
            aria-label="Expandir ou reduzir terminal"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Stream Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-3.5 overflow-y-auto space-y-1.5 select-text scroll-smooth"
      >
        {/* Startup banner */}
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800/60 leading-relaxed">
          <span>Python 3.12.0 Interactive Session · Execução e streaming em tempo real</span>
          <br />
          <span>Digite qualquer comando Python abaixo ou interaja com as teclas da calculadora.</span>
        </div>

        {logs.map((log) => {
          if (log.type === 'input') {
            return (
              <div key={log.id} className="flex items-start gap-2 text-indigo-300">
                <span className="text-indigo-400 select-none font-bold">&gt;&gt;&gt;</span>
                <span className="font-mono break-all">{log.text}</span>
              </div>
            );
          }
          if (log.type === 'output') {
            return (
              <div key={log.id} className="flex items-start justify-between gap-3 text-emerald-400 pl-6">
                <span className="font-mono break-all">{log.text}</span>
                {log.executionTimeMs !== undefined && (
                  <span className="text-[10px] text-slate-500 shrink-0 select-none font-mono">
                    [{log.executionTimeMs}ms]
                  </span>
                )}
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={log.id} className="flex items-start gap-2 text-rose-400 pl-6 bg-rose-950/20 p-1.5 rounded border border-rose-900/40">
                <span className="font-mono break-all">{log.text}</span>
              </div>
            );
          }
          return (
            <div key={log.id} className="text-slate-400 pl-6 italic">
              {log.text}
            </div>
          );
        })}
      </div>

      {/* Quick Snippets Bar */}
      <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-slate-500 shrink-0 select-none mr-1">Exemplos:</span>
        {quickSnippets.map((snippet) => (
          <button
            key={snippet}
            onClick={() => onExecutePythonCommand(snippet)}
            className="shrink-0 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors border border-slate-700/50"
          >
            {snippet}
          </button>
        ))}
      </div>

      {/* Interactive REPL Prompt Input Form */}
      <form
        onSubmit={handleSubmit}
        className="h-11 px-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <span className="text-indigo-400 font-bold select-none">&gt;&gt;&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Digite um comando Python ou científico (ex: sin(30), 5!, mean(10, 20), Ans + 50)..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs"
        />
        <button
          type="submit"
          className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40"
          disabled={!commandInput.trim()}
          title="Executar comando Python"
          aria-label="Executar comando Python"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
