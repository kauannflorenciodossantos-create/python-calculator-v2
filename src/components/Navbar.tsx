import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Terminal, History, RotateCcw, FileCode } from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  isTerminalOpen: boolean;
  onToggleTerminal: () => void;
  onResetAll: () => void;
  onOpenPythonCode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  isHistoryOpen,
  onToggleHistory,
  isTerminalOpen,
  onToggleTerminal,
  onResetAll,
  onOpenPythonCode,
}) => {
  return (
    <header className={`w-full border-b transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-900/70 border-slate-800/80 backdrop-blur-xl' 
        : 'bg-white/80 border-slate-200/90 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark (clean display font, single element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-mono font-bold text-lg select-none">
            py
          </div>
          <div>
            <span className={`text-base font-bold tracking-tight whitespace-nowrap block ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              PyCalc Studio
            </span>
            <span className="text-[10px] text-indigo-500 font-mono tracking-wider uppercase block">
              Python 3.12 Engine
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation / View Toggles */}
        <nav className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={onToggleTerminal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isTerminalOpen
                ? theme === 'dark'
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : theme === 'dark'
                  ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Alternar Terminal Python"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Terminal</span>
          </button>

          <button
            onClick={onToggleHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isHistoryOpen
                ? theme === 'dark'
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : theme === 'dark'
                  ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Alternar Histórico de Cálculos"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Histórico</span>
          </button>

          <button
            onClick={onOpenPythonCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'border-slate-800 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
                : 'border-slate-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
            title="Ver arquivo de código Python nativo (/calculator.py)"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Código .py</span>
          </button>

          <button
            onClick={onResetAll}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Reiniciar Sessão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Controls (Sound + Dark/Light Theme) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Mute & Volume */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? theme === 'dark'
                    ? 'border-slate-800 text-slate-500 bg-slate-900/50 hover:text-slate-400'
                    : 'border-slate-200 text-slate-400 bg-slate-50 hover:text-slate-600'
                  : theme === 'dark'
                    ? 'border-indigo-500/30 text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/50'
                    : 'border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70'
              }`}
              title={isMuted ? 'Ativar efeitos sonoros' : 'Silenciar sons'}
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {!isMuted && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-20 h-1.5 accent-indigo-500 cursor-pointer hidden sm:inline-block"
                title={`Volume: ${Math.round(volume * 100)}%`}
                aria-label="Volume dos efeitos sonoros"
              />
            )}
          </div>

          <div className={`h-4 w-px mx-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
              theme === 'dark'
                ? 'border-slate-800 bg-slate-900/60 text-amber-300 hover:bg-slate-800/70 hover:text-amber-200'
                : 'border-slate-200 bg-slate-100/80 text-indigo-700 hover:bg-slate-200/70'
            }`}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Escuro</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
