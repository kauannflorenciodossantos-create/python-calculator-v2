/**
 * PyCalc Studio - Python Engine Científico
 * =======================================
 * Suporta avaliação instantânea local e integração WebAssembly (Pyodide)
 * com funções trigonométricas (DEG/RAD/GRAD), fatoriais, constantes (pi, e, tau),
 * variáveis, memória (Ans, STO, RCL, M+), notação científica e estatística.
 */

import { AngleMode } from '../types';

export interface PythonExecutionResult {
  result: string;
  pythonCode: string;
  stdout: string;
  executionTimeMs: number;
  status: 'success' | 'error';
  errorDetail?: string;
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: () => Promise<PyodideInterface>;
    pyodideInstance?: PyodideInterface;
  }
}

class PythonEngine {
  private isPyodideLoading: boolean = false;
  private isPyodideReady: boolean = false;
  private pyodide: PyodideInterface | null = null;

  private angleMode: AngleMode = 'DEG';
  private ans: number = 0;
  private memory: number = 0;
  private variableStore: Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    X: 0,
    Y: 0,
    M: 0,
  };

  constructor() {
    this.initPyodide();
  }

  public getAngleMode(): AngleMode {
    return this.angleMode;
  }

  public setAngleMode(mode: AngleMode): void {
    this.angleMode = mode;
    if (this.isPyodideReady && this.pyodide) {
      this.pyodide.runPythonAsync(`_angle_mode = '${mode}'`).catch(() => {});
    }
  }

  public getMemory(): number {
    return this.memory;
  }

  public getAns(): number {
    return this.ans;
  }

  public getVariables(): Record<string, number> {
    return { ...this.variableStore };
  }

  public sto(variable: string, val: number): number {
    const key = variable.trim().toUpperCase();
    this.variableStore[key] = val;
    if (key === 'M') {
      this.memory = val;
    }
    if (this.isPyodideReady && this.pyodide) {
      this.pyodide.runPythonAsync(`variables['${key}'] = ${val}; ${key} = ${val}`).catch(() => {});
    }
    return val;
  }

  public rcl(variable: string): number {
    const key = variable.trim().toUpperCase();
    if (key === 'M') return this.memory;
    return this.variableStore[key] ?? 0;
  }

  public mPlus(val: number): number {
    this.memory += val;
    this.variableStore['M'] = this.memory;
    if (this.isPyodideReady && this.pyodide) {
      this.pyodide.runPythonAsync(`memory += ${val}; M = memory; variables['M'] = memory`).catch(() => {});
    }
    return this.memory;
  }

  public mMinus(val: number): number {
    this.memory -= val;
    this.variableStore['M'] = this.memory;
    if (this.isPyodideReady && this.pyodide) {
      this.pyodide.runPythonAsync(`memory -= ${val}; M = memory; variables['M'] = memory`).catch(() => {});
    }
    return this.memory;
  }

  public mClear(): number {
    this.memory = 0;
    this.variableStore['M'] = 0;
    if (this.isPyodideReady && this.pyodide) {
      this.pyodide.runPythonAsync(`memory = 0.0; M = 0.0; variables['M'] = 0.0`).catch(() => {});
    }
    return 0;
  }

  /**
   * Asynchronously load Pyodide WebAssembly for genuine CPython in the browser.
   */
  private async initPyodide(): Promise<void> {
    if (typeof window === 'undefined' || this.isPyodideLoading || this.isPyodideReady) return;
    this.isPyodideLoading = true;

    try {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
        });
      }

      if (window.loadPyodide) {
        this.pyodide = await window.loadPyodide();
        const initScript = `
import math, sys

_angle_mode = '${this.angleMode}'
ans = 0.0
Ans = 0.0
memory = 0.0
M = 0.0
variables = {'A': 0.0, 'B': 0.0, 'C': 0.0, 'X': 0.0, 'Y': 0.0, 'M': 0.0}
A = B = C = X = Y = 0.0

def _to_rad(x):
    if _angle_mode == 'DEG': return math.radians(x)
    if _angle_mode == 'GRAD': return x * (math.pi / 200.0)
    return x

def _from_rad(r):
    if _angle_mode == 'DEG': return math.degrees(r)
    if _angle_mode == 'GRAD': return r * (200.0 / math.pi)
    return r

def sin(x):
    res = math.sin(_to_rad(x))
    return 0.0 if abs(res) < 1e-15 else res

def cos(x):
    res = math.cos(_to_rad(x))
    return 0.0 if abs(res) < 1e-15 else res

def tan(x):
    c = cos(x)
    if abs(c) < 1e-15: raise ValueError("Tangente indefinida (divisão por zero).")
    res = math.tan(_to_rad(x))
    return 0.0 if abs(res) < 1e-15 else res

def asin(x): return _from_rad(math.asin(x))
def acos(x): return _from_rad(math.acos(x))
def atan(x): return _from_rad(math.atan(x))
def atan2(y, x): return _from_rad(math.atan2(y, x))
def sinh(x): return math.sinh(x)
def cosh(x): return math.cosh(x)
def tanh(x): return math.tanh(x)
def asinh(x): return math.asinh(x)
def acosh(x): return math.acosh(x)
def atanh(x): return math.atanh(x)

def sqrt(x): return math.sqrt(x)
def cbrt(x): return math.copysign(abs(x)**(1/3), x)
def ln(x): return math.log(x)
def log10(x): return math.log10(x)
def log2(x): return math.log2(x)
def log(x, base=10): return math.log(x, base) if base != 10 else math.log10(x)
def exp(x): return math.exp(x)
def factorial(n): return math.factorial(int(n))
def fact(n): return math.factorial(int(n))
def nCr(n, r): return math.comb(int(n), int(r))
def comb(n, r): return math.comb(int(n), int(r))
def nPr(n, r): return math.perm(int(n), int(r))
def perm(n, r): return math.perm(int(n), int(r))

def _flat(args):
    res = []
    for a in args:
        if isinstance(a, (list, tuple)): res.extend(a)
        else: res.append(a)
    return res

def mean(*args):
    v = _flat(args)
    if not v: raise ValueError("mean requer valores")
    return sum(v) / len(v)

def median(*args):
    v = sorted(_flat(args))
    if not v: raise ValueError("median requer valores")
    n = len(v)
    return v[n//2] if n%2==1 else (v[n//2-1]+v[n//2])/2

def std(*args):
    v = _flat(args)
    if len(v) < 2: return 0.0
    m = sum(v)/len(v)
    return math.sqrt(sum((x-m)**2 for x in v)/(len(v)-1))

def variance(*args):
    v = _flat(args)
    if len(v) < 2: return 0.0
    m = sum(v)/len(v)
    return sum((x-m)**2 for x in v)/(len(v)-1)

def stats_sum(*args):
    return sum(_flat(args))

pi = math.pi
PI = math.pi
e = math.e
E = math.e
tau = math.tau
`;
        await this.pyodide.runPythonAsync(initScript);
        this.isPyodideReady = true;
      }
    } catch {
      this.isPyodideReady = false;
    } finally {
      this.isPyodideLoading = false;
    }
  }

  public getStatus(): { isReady: boolean; isLoading: boolean; mode: 'pyodide' | 'local_python' } {
    return {
      isReady: this.isPyodideReady,
      isLoading: this.isPyodideLoading,
      mode: this.isPyodideReady ? 'pyodide' : 'local_python',
    };
  }

  /**
   * Converts UI expression tokens into standard Python code
   */
  public convertToPython(expr: string): string {
    let code = expr.trim();
    if (!code) return '0';

    // 1. Substituições básicas de exibição
    code = code.replace(/×/g, ' * ');
    code = code.replace(/÷/g, ' / ');
    code = code.replace(/\^/g, ' ** ');
    code = code.replace(/²/g, ' ** 2');
    code = code.replace(/³/g, ' ** 3');
    code = code.replace(/π/g, 'pi');
    code = code.replace(/mod/gi, ' % ');

    // 2. Raiz quadrada e cúbica
    code = code.replace(/√\s*(\d+(\.\d+)?)/g, 'sqrt($1)');
    code = code.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
    code = code.replace(/∛\s*(\d+(\.\d+)?)/g, 'cbrt($1)');
    code = code.replace(/∛\(([^)]+)\)/g, 'cbrt($1)');

    // 3. Notação Científica EE / EXP
    code = code.replace(/(\d+(?:\.\d+)?)\s*(?:EE|EXP)\s*([+-]?\d+)/gi, '$1e$2');

    // 4. Fatorial postfix: 5! -> factorial(5), (3+2)! -> factorial((3+2))
    while (code.includes('!') && !code.includes('!=') && !code.includes('!==')) {
      const nextCode = code.replace(
        /(\((?:[^()]+|\([^()]*\))*\)|\b\d+(?:\.\d+)?|[a-zA-Z_]\w*)!/g,
        'factorial($1)'
      );
      if (nextCode === code) break;
      code = nextCode;
    }

    // 5. Multiplicação implícita
    // 2(3) -> 2*(3)
    code = code.replace(/(?<![\w.])(\d+(?:\.\d+)?)\s*\(/g, '$1*(');
    // )( -> )*(
    code = code.replace(/\)\s*\(/g, ')*(');
    // )2 -> )*2
    code = code.replace(/\)\s*(\d+(?:\.\d+)?)/g, ')*$1');
    // 2pi -> 2*pi, 3sin(x) -> 3*sin(x), 5e -> 5*e (sem quebrar 1e5)
    code = code.replace(/(?<![\w.])(\d+(?:\.\d+)?)\s*([a-df-zA-DF-Z_]\w*|e(?![+-]?\d))\b/g, '$1*$2');
    // )pi -> )*pi
    code = code.replace(/\)\s*([a-zA-Z_]\w*)/g, ')*$1');

    // Normaliza múltiplos espaços
    code = code.replace(/\s+/g, ' ').trim();
    return code;
  }

  /**
   * Execute Python code with real timing and stdout capture
   */
  public async execute(rawCode: string): Promise<PythonExecutionResult> {
    const startTime = performance.now();
    const cleanRaw = rawCode.trim();

    // Comandos de modo angular especiais
    const modeMatch = cleanRaw.match(/^MODE\s+(DEG|RAD|GRAD)$/i);
    if (modeMatch) {
      const newMode = modeMatch[1].toUpperCase() as AngleMode;
      this.setAngleMode(newMode);
      const endTime = performance.now();
      return {
        result: newMode,
        pythonCode: `MODE ${newMode}`,
        stdout: `Modo angular alterado para: ${newMode}`,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
        status: 'success',
      };
    }

    const pythonCode = this.convertToPython(cleanRaw);
    let capturedStdout = '';

    // Pyodide Execution
    if (this.isPyodideReady && this.pyodide) {
      try {
        this.pyodide.setStdout({
          batched: (text: string) => {
            capturedStdout += text + '\n';
          },
        });
        this.pyodide.setStderr({
          batched: (text: string) => {
            capturedStdout += '[stderr] ' + text + '\n';
          },
        });

        // Atualiza variáveis atuais e modo angular no Pyodide
        await this.pyodide.runPythonAsync(`
_angle_mode = '${this.angleMode}'
ans = ${this.ans}
Ans = ${this.ans}
memory = ${this.memory}
M = ${this.memory}
`);

        const rawResult = await this.pyodide.runPythonAsync(pythonCode);
        const endTime = performance.now();
        const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

        let resultStr = '0';
        if (typeof rawResult === 'number') {
          this.ans = rawResult;
          resultStr = this.formatNumber(rawResult);
        } else if (rawResult !== undefined && rawResult !== null) {
          resultStr = String(rawResult);
        } else {
          resultStr = capturedStdout.trim() || 'None';
        }

        return {
          result: resultStr,
          pythonCode,
          stdout: capturedStdout.trim(),
          executionTimeMs,
          status: 'success',
        };
      } catch (err: unknown) {
        const endTime = performance.now();
        const errMsg = err instanceof Error ? err.message : String(err);
        return {
          result: 'Erro',
          pythonCode,
          stdout: capturedStdout.trim(),
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'error',
          errorDetail: errMsg,
        };
      }
    }

    // Local Python Engine Fallback
    return this.evaluateLocalPython(pythonCode, startTime);
  }

  /**
   * Format numbers gracefully, preserving integers, avoiding float noise,
   * and formatting in scientific notation for very large or very small values.
   */
  private formatNumber(val: number): string {
    if (!isFinite(val)) {
      throw new Error('ZeroDivisionError: division by zero');
    }
    if (Number.isInteger(val)) {
      if (Math.abs(val) >= 1e15) {
        return val.toExponential(8).replace(/\+?0*(\d+)$/, '+$1');
      }
      return val.toString();
    }

    const abs = Math.abs(val);
    if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
      return val.toExponential(7).replace(/\+?0*(\d+)$/, '+$1');
    }

    // Remove noise: ex 0.30000000000000004 -> 0.3
    const rounded = parseFloat(val.toFixed(10));
    return rounded.toString();
  }

  /**
   * Robust local Python evaluator with full scientific mathematics
   */
  private evaluateLocalPython(pythonCode: string, startTime: number): PythonExecutionResult {
    let stdout = '';
    try {
      const codeToEval = pythonCode;

      // Handle variable assignment (e.g. A = 50, STO A = 50)
      const assignMatch = codeToEval.match(/^(?:STO\s+)?([a-zA-Z_]\w*)\s*=\s*(.+)$/i);
      if (assignMatch) {
        const varName = assignMatch[1].toUpperCase();
        const valExpr = assignMatch[2];
        const evalSub = this.evaluateExpression(valExpr);
        this.sto(varName, evalSub);
        this.ans = evalSub;
        const endTime = performance.now();
        return {
          result: this.formatNumber(evalSub),
          pythonCode,
          stdout: `${varName} = ${this.formatNumber(evalSub)}`,
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'success',
        };
      }

      // Handle print()
      const printMatch = codeToEval.match(/^print\((.*)\)$/);
      if (printMatch) {
        const inner = printMatch[1];
        const val = this.evaluateExpression(inner);
        stdout = this.formatNumber(val);
        const endTime = performance.now();
        return {
          result: stdout,
          pythonCode,
          stdout,
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'success',
        };
      }

      const val = this.evaluateExpression(codeToEval);
      this.ans = val;
      const endTime = performance.now();
      const formattedVal = this.formatNumber(val);

      return {
        result: formattedVal,
        pythonCode,
        stdout,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
        status: 'success',
      };
    } catch (err: unknown) {
      const endTime = performance.now();
      const errMsg = err instanceof Error ? err.message : String(err);
      let pythonFriendlyError = errMsg;
      if (errMsg.includes('division by zero') || errMsg.includes('Infinity')) {
        pythonFriendlyError = 'ZeroDivisionError: division by zero';
      } else if (errMsg.includes('Unexpected token') || errMsg.includes('SyntaxError')) {
        pythonFriendlyError = 'SyntaxError: invalid syntax';
      }

      return {
        result: 'Erro',
        pythonCode,
        stdout,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
        status: 'error',
        errorDetail: pythonFriendlyError,
      };
    }
  }

  // Trigonometric Helpers
  private toRad(x: number): number {
    if (this.angleMode === 'DEG') return (x * Math.PI) / 180;
    if (this.angleMode === 'GRAD') return (x * Math.PI) / 200;
    return x;
  }

  private fromRad(r: number): number {
    if (this.angleMode === 'DEG') return (r * 180) / Math.PI;
    if (this.angleMode === 'GRAD') return (r * 200) / Math.PI;
    return r;
  }

  private calcSin(x: number): number {
    const res = Math.sin(this.toRad(x));
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  private calcCos(x: number): number {
    const res = Math.cos(this.toRad(x));
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  private calcTan(x: number): number {
    const c = this.calcCos(x);
    if (Math.abs(c) < 1e-15) {
      throw new Error('ValueError: Tangente indefinida');
    }
    const res = Math.tan(this.toRad(x));
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  private calcAsin(x: number): number {
    if (x < -1 || x > 1) throw new Error('ValueError: math domain error');
    return this.fromRad(Math.asin(x));
  }

  private calcAcos(x: number): number {
    if (x < -1 || x > 1) throw new Error('ValueError: math domain error');
    return this.fromRad(Math.acos(x));
  }

  private calcAtan(x: number): number {
    return this.fromRad(Math.atan(x));
  }

  private calcFactorial(n: number): number {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('ValueError: factorial() only accepts integral non-negative values');
    }
    if (n > 5000) throw new Error('OverflowError: factorial value too large');
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  private calcNCr(n: number, r: number): number {
    if (r < 0 || r > n) return 0;
    return this.calcFactorial(n) / (this.calcFactorial(r) * this.calcFactorial(n - r));
  }

  private calcNPr(n: number, r: number): number {
    if (r < 0 || r > n) return 0;
    return this.calcFactorial(n) / this.calcFactorial(n - r);
  }

  private calcMean(args: (number | number[])[]): number {
    const flat = args.flat();
    if (!flat.length) throw new Error('ValueError: mean requires at least one data point');
    return flat.reduce((a, b) => a + b, 0) / flat.length;
  }

  private calcMedian(args: (number | number[])[]): number {
    const flat = args.flat().sort((a, b) => a - b);
    if (!flat.length) throw new Error('ValueError: median requires at least one data point');
    const mid = Math.floor(flat.length / 2);
    return flat.length % 2 !== 0 ? flat[mid] : (flat[mid - 1] + flat[mid]) / 2;
  }

  private calcStd(args: (number | number[])[]): number {
    const flat = args.flat();
    if (flat.length < 2) return 0;
    const m = this.calcMean(flat);
    const variance = flat.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / (flat.length - 1);
    return Math.sqrt(variance);
  }

  private calcVariance(args: (number | number[])[]): number {
    const flat = args.flat();
    if (flat.length < 2) return 0;
    const m = this.calcMean(flat);
    return flat.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / (flat.length - 1);
  }

  private calcSum(args: (number | number[])[]): number {
    return args.flat().reduce((a, b) => a + b, 0);
  }

  private evaluateExpression(expr: string): number {
    // Check division by zero explicitly
    if (/\/(\s*)0+(\.0*)?(\D|$)/.test(expr) || /\/\/(\s*)0+(\.0*)?(\D|$)/.test(expr)) {
      throw new Error('ZeroDivisionError: division by zero');
    }

    let parsed = expr;

    // Substitute Ans / ans
    parsed = parsed.replace(/\bAns\b/gi, String(this.ans));

    // Substitute variables
    for (const [key, value] of Object.entries(this.variableStore)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      parsed = parsed.replace(regex, String(value));
    }

    // Replace Python integer division //
    while (parsed.includes('//')) {
      parsed = parsed.replace(/([0-9.]+|\([^)]+\))\s*\/\/\s*([0-9.]+|\([^)]+\))/, (_, a, b) => {
        return `Math.floor((${a}) / (${b}))`;
      });
    }

    // Map math constants and aliases
    parsed = parsed
      .replace(/\bpi\b/gi, String(Math.PI))
      .replace(/\btau\b/gi, String(Math.PI * 2))
      .replace(/\be\b(?![+-]?\d)/gi, String(Math.E));

    // Prepare scope functions for evaluation
    const scopeFunctions = {
      sin: (x: number) => this.calcSin(x),
      cos: (x: number) => this.calcCos(x),
      tan: (x: number) => this.calcTan(x),
      asin: (x: number) => this.calcAsin(x),
      acos: (x: number) => this.calcAcos(x),
      atan: (x: number) => this.calcAtan(x),
      sinh: (x: number) => Math.sinh(x),
      cosh: (x: number) => Math.cosh(x),
      tanh: (x: number) => Math.tanh(x),
      asinh: (x: number) => Math.asinh(x),
      acosh: (x: number) => Math.acosh(x),
      atanh: (x: number) => Math.atanh(x),
      sqrt: (x: number) => {
        if (x < 0) throw new Error('ValueError: math domain error');
        return Math.sqrt(x);
      },
      cbrt: (x: number) => Math.cbrt(x),
      ln: (x: number) => {
        if (x <= 0) throw new Error('ValueError: math domain error');
        return Math.log(x);
      },
      log10: (x: number) => {
        if (x <= 0) throw new Error('ValueError: math domain error');
        return Math.log10(x);
      },
      log2: (x: number) => {
        if (x <= 0) throw new Error('ValueError: math domain error');
        return Math.log2(x);
      },
      log: (x: number, base: number = 10) => {
        if (x <= 0) throw new Error('ValueError: math domain error');
        return base === 10 ? Math.log10(x) : Math.log(x) / Math.log(base);
      },
      exp: (x: number) => Math.exp(x),
      factorial: (n: number) => this.calcFactorial(n),
      fact: (n: number) => this.calcFactorial(n),
      abs: (x: number) => Math.abs(x),
      round: (x: number) => Math.round(x),
      pow: (x: number, y: number) => Math.pow(x, y),
      nCr: (n: number, r: number) => this.calcNCr(n, r),
      comb: (n: number, r: number) => this.calcNCr(n, r),
      nPr: (n: number, r: number) => this.calcNPr(n, r),
      perm: (n: number, r: number) => this.calcNPr(n, r),
      mean: (...args: (number | number[])[]) => this.calcMean(args),
      median: (...args: (number | number[])[]) => this.calcMedian(args),
      std: (...args: (number | number[])[]) => this.calcStd(args),
      variance: (...args: (number | number[])[]) => this.calcVariance(args),
      sum: (...args: (number | number[])[]) => this.calcSum(args),
    };

    // Sanitize check
    const sanitized = parsed.replace(
      /[^0-9+\-*/%.()[\],MathfloorsincostanasinacosatanhsqrtcbrtlnlogexporundfactorialfactabspownCrcombnPrpermmeanmedianstdvariancesum\s]/g,
      ''
    );

    if (!sanitized.trim()) {
      throw new Error('SyntaxError: invalid syntax');
    }

    // eslint-disable-next-line no-new-func
    const evaluator = new Function(
      ...Object.keys(scopeFunctions),
      `"use strict"; return (${sanitized});`
    );

    const res = evaluator(...Object.values(scopeFunctions));

    if (typeof res !== 'number' || isNaN(res)) {
      throw new Error('ValueError: math domain error');
    }
    if (!isFinite(res)) {
      throw new Error('ZeroDivisionError: division by zero');
    }

    return res;
  }
}

export const pythonEngine = new PythonEngine();
