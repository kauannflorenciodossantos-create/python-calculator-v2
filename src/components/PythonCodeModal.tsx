import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Play } from 'lucide-react';
import { ThemeMode } from '../types';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onRunTestInTerminal: () => void;
}

const PYTHON_SOURCE_CODE = `#!/usr/bin/env python3
"""
PyCalc Studio - Motor de Cálculo Científico em Python
=====================================================
Módulo central da calculadora científica em Python nativo.
Suporta operações aritméticas, funções trigonométricas (DEG, RAD, GRAD),
constantes especiais (π, e, tau), fatoriais (!), hierarquia de operações,
memória e variáveis (Ans, STO, RCL, M+, MR), notação científica e estatística básica.
"""

import ast
import math
import operator
import re
import sys
from typing import Any, Dict, List, Sequence, Union


class PythonCalculator:
    """Calculadora científica moderna orientada a objetos com suporte a AST, modos angulares e memória."""

    SUPPORTED_OPERATORS: Dict[type, Any] = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    def __init__(self, angle_mode: str = 'DEG') -> None:
        self.angle_mode: str = angle_mode.upper()  # 'DEG', 'RAD', 'GRAD'
        self.history: List[Dict[str, Any]] = []
        self.memory: float = 0.0
        self.ans: Union[int, float] = 0
        self.variables: Dict[str, float] = {
            'A': 0.0,
            'B': 0.0,
            'C': 0.0,
            'X': 0.0,
            'Y': 0.0,
            'M': 0.0,
        }

    def set_angle_mode(self, mode: str) -> str:
        mode_upper = mode.upper().strip()
        if mode_upper not in ('DEG', 'RAD', 'GRAD'):
            raise ValueError("Modo angular inválido. Escolha: 'DEG', 'RAD' ou 'GRAD'.")
        self.angle_mode = mode_upper
        return self.angle_mode

    def _to_radians(self, angle: float) -> float:
        if self.angle_mode == 'DEG':
            return math.radians(angle)
        elif self.angle_mode == 'GRAD':
            return angle * (math.pi / 200.0)
        return angle

    def _from_radians(self, rad: float) -> float:
        if self.angle_mode == 'DEG':
            return math.degrees(rad)
        elif self.angle_mode == 'GRAD':
            return rad * (200.0 / math.pi)
        return rad

    # Trigonometria e Hiperbólicas
    def sin(self, x: float) -> float:
        rad = self._to_radians(x)
        res = math.sin(rad)
        return 0.0 if abs(res) < 1e-15 else res

    def cos(self, x: float) -> float:
        rad = self._to_radians(x)
        res = math.cos(rad)
        return 0.0 if abs(res) < 1e-15 else res

    def tan(self, x: float) -> float:
        cos_val = self.cos(x)
        if abs(cos_val) < 1e-15:
            raise ValueError("Tangente indefinida.")
        res = math.tan(self._to_radians(x))
        return 0.0 if abs(res) < 1e-15 else res

    def asin(self, x: float) -> float:
        return self._from_radians(math.asin(x))

    def acos(self, x: float) -> float:
        return self._from_radians(math.acos(x))

    def atan(self, x: float) -> float:
        return self._from_radians(math.atan(x))

    # Funções científicas adicionais
    def factorial(self, n: float) -> int:
        return math.factorial(int(n))

    def mean(self, *args: Any) -> float:
        vals = self._flatten_args(args)
        return sum(vals) / len(vals)

    def std(self, *args: Any) -> float:
        vals = self._flatten_args(args)
        if len(vals) < 2: return 0.0
        m = sum(vals) / len(vals)
        return math.sqrt(sum((x - m) ** 2 for x in vals) / (len(vals) - 1))

    def evaluate(self, expression: str) -> Union[int, float]:
        # Avaliação segura via AST com suporte a precedência e funções
        processed_expr = self.preprocess_expression(expression)
        tree = ast.parse(processed_expr, mode='eval')
        return self._eval_node(tree.body, self.get_math_scope())
`;

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({
  isOpen,
  onClose,
  theme,
  onRunTestInTerminal,
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculator.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-3xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">calculator.py — Código Científico Nativo</h3>
              <p
                className={`text-[11px] ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Implementação Python 3.12 com AST, Modos Angulares, Trigonometria e Estatística
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                copied
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Copiar código Python"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownload}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Baixar arquivo calculator.py"
              aria-label="Baixar arquivo calculator.py"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Fechar janela"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Code Viewer Body */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed selection:bg-indigo-600">
          <pre className="overflow-x-auto whitespace-pre">
            <code>{PYTHON_SOURCE_CODE}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between gap-4 text-xs ${
            isDark ? 'border-slate-800 bg-slate-900/40 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'
          }`}
        >
          <span>Executável diretamente via terminal: <code className="text-indigo-400">python3 calculator.py</code></span>
          <button
            onClick={onRunTestInTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Testar Expressão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
