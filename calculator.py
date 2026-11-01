#!/usr/bin/env python3
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

    # ---------------------------------------------------------
    # Controle de Modos Angulares (DEG / RAD / GRAD)
    # ---------------------------------------------------------
    def set_angle_mode(self, mode: str) -> str:
        """Altera a unidade angular corrente para 'DEG', 'RAD' ou 'GRAD'."""
        mode_upper = mode.upper().strip()
        if mode_upper not in ('DEG', 'RAD', 'GRAD'):
            raise ValueError("Modo angular inválido. Escolha entre: 'DEG', 'RAD' ou 'GRAD'.")
        self.angle_mode = mode_upper
        return self.angle_mode

    def _to_radians(self, angle: float) -> float:
        """Converte um ângulo da unidade ativa para radianos."""
        if self.angle_mode == 'DEG':
            return math.radians(angle)
        elif self.angle_mode == 'GRAD':
            return angle * (math.pi / 200.0)
        return angle  # 'RAD'

    def _from_radians(self, rad: float) -> float:
        """Converte radianos para a unidade angular ativa."""
        if self.angle_mode == 'DEG':
            return math.degrees(rad)
        elif self.angle_mode == 'GRAD':
            return rad * (200.0 / math.pi)
        return rad  # 'RAD'

    # ---------------------------------------------------------
    # Funções Trigonométricas e Hiperbólicas
    # ---------------------------------------------------------
    def sin(self, x: float) -> float:
        """Seno respeitando o modo angular ativo."""
        rad = self._to_radians(x)
        res = math.sin(rad)
        return 0.0 if abs(res) < 1e-15 else res

    def cos(self, x: float) -> float:
        """Cosseno respeitando o modo angular ativo."""
        rad = self._to_radians(x)
        res = math.cos(rad)
        return 0.0 if abs(res) < 1e-15 else res

    def tan(self, x: float) -> float:
        """Tangente respeitando o modo angular ativo."""
        cos_val = self.cos(x)
        if abs(cos_val) < 1e-15:
            raise ValueError("Tangente indefinida (divisão por cosseno zero).")
        res = math.tan(self._to_radians(x))
        return 0.0 if abs(res) < 1e-15 else res

    def asin(self, x: float) -> float:
        """Arco seno com retorno na unidade angular ativa."""
        if not -1.0 <= x <= 1.0:
            raise ValueError("Domínio inválido para asin: valor deve estar entre -1 e 1.")
        return self._from_radians(math.asin(x))

    def acos(self, x: float) -> float:
        """Arco cosseno com retorno na unidade angular ativa."""
        if not -1.0 <= x <= 1.0:
            raise ValueError("Domínio inválido para acos: valor deve estar entre -1 e 1.")
        return self._from_radians(math.acos(x))

    def atan(self, x: float) -> float:
        """Arco tangente com retorno na unidade angular ativa."""
        return self._from_radians(math.atan(x))

    def atan2(self, y: float, x: float) -> float:
        """Arco tangente de dois argumentos (y, x) com retorno na unidade angular ativa."""
        return self._from_radians(math.atan2(y, x))

    def sinh(self, x: float) -> float:
        """Seno hiperbólico."""
        return math.sinh(x)

    def cosh(self, x: float) -> float:
        """Cosseno hiperbólico."""
        return math.cosh(x)

    def tanh(self, x: float) -> float:
        """Tangente hiperbólica."""
        return math.tanh(x)

    def asinh(self, x: float) -> float:
        """Arco seno hiperbólico."""
        return math.asinh(x)

    def acosh(self, x: float) -> float:
        """Arco cosseno hiperbólico."""
        if x < 1.0:
            raise ValueError("Domínio inválido para acosh: valor deve ser >= 1.")
        return math.acosh(x)

    def atanh(self, x: float) -> float:
        """Arco tangente hiperbólica."""
        if not -1.0 < x < 1.0:
            raise ValueError("Domínio inválido para atanh: valor deve estar entre -1 e 1.")
        return math.atanh(x)

    # ---------------------------------------------------------
    # Operações Básicas e Potências
    # ---------------------------------------------------------
    def add(self, a: float, b: float) -> float:
        return a + b

    def subtract(self, a: float, b: float) -> float:
        return a - b

    def multiply(self, a: float, b: float) -> float:
        return a * b

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Divisão por zero não é permitida.")
        return a / b

    def int_divide(self, a: float, b: float) -> int:
        if b == 0:
            raise ZeroDivisionError("Divisão inteira por zero não é permitida.")
        return int(a // b)

    def power(self, a: float, b: float) -> float:
        return a ** b

    def modulo(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Módulo por zero não é permitido.")
        return a % b

    def square_root(self, a: float) -> float:
        if a < 0:
            raise ValueError("Não é possível calcular a raiz quadrada de um número negativo no conjunto real.")
        return math.sqrt(a)

    def cube_root(self, a: float) -> float:
        """Raiz cúbica real."""
        return math.copysign(abs(a) ** (1.0 / 3.0), a)

    def factorial(self, n: float) -> int:
        """Fatorial (!) para inteiros não negativos."""
        if isinstance(n, float) and not n.is_integer():
            raise ValueError("Fatorial só é definido para números inteiros.")
        n_int = int(n)
        if n_int < 0:
            raise ValueError("Fatorial de número negativo não é definido.")
        if n_int > 5000:
            raise ValueError("Valor de fatorial excessivamente grande.")
        return math.factorial(n_int)

    def ln(self, x: float) -> float:
        """Logaritmo natural (base e)."""
        if x <= 0:
            raise ValueError("Logaritmo de número não positivo não é definido.")
        return math.log(x)

    def log10(self, x: float) -> float:
        """Logaritmo decimal (base 10)."""
        if x <= 0:
            raise ValueError("Logaritmo de número não positivo não é definido.")
        return math.log10(x)

    def log2(self, x: float) -> float:
        """Logaritmo binário (base 2)."""
        if x <= 0:
            raise ValueError("Logaritmo de número não positivo não é definido.")
        return math.log2(x)

    def exp(self, x: float) -> float:
        """Exponencial e^x."""
        return math.exp(x)

    def nCr(self, n: float, r: float) -> int:
        """Combinações simples C(n, r)."""
        return math.comb(int(n), int(r))

    def nPr(self, n: float, r: float) -> int:
        """Arranjos simples / permutações P(n, r)."""
        return math.perm(int(n), int(r))

    # ---------------------------------------------------------
    # Estatística Básica
    # ---------------------------------------------------------
    def _flatten_args(self, args: Sequence[Any]) -> List[float]:
        """Auxiliar para aceitar listas ou argumentos soltos: mean([1,2,3]) ou mean(1,2,3)."""
        vals: List[float] = []
        for arg in args:
            if isinstance(arg, (list, tuple)):
                vals.extend([float(x) for x in arg])
            else:
                vals.append(float(arg))
        return vals

    def mean(self, *args: Any) -> float:
        """Média aritmética de uma lista de valores."""
        vals = self._flatten_args(args)
        if not vals:
            raise ValueError("A função mean() requer ao menos um valor.")
        return sum(vals) / len(vals)

    def median(self, *args: Any) -> float:
        """Mediana de uma lista de valores."""
        vals = sorted(self._flatten_args(args))
        if not vals:
            raise ValueError("A função median() requer ao menos um valor.")
        n = len(vals)
        mid = n // 2
        if n % 2 == 1:
            return vals[mid]
        return (vals[mid - 1] + vals[mid]) / 2.0

    def std(self, *args: Any) -> float:
        """Desvio padrão amostral de uma lista de valores."""
        vals = self._flatten_args(args)
        if len(vals) < 2:
            return 0.0
        m = sum(vals) / len(vals)
        var = sum((x - m) ** 2 for x in vals) / (len(vals) - 1)
        return math.sqrt(var)

    def variance(self, *args: Any) -> float:
        """Variância amostral."""
        vals = self._flatten_args(args)
        if len(vals) < 2:
            return 0.0
        m = sum(vals) / len(vals)
        return sum((x - m) ** 2 for x in vals) / (len(vals) - 1)

    def stats_sum(self, *args: Any) -> float:
        """Somatório dos elementos."""
        vals = self._flatten_args(args)
        return float(sum(vals))

    # ---------------------------------------------------------
    # Memória e Variáveis
    # ---------------------------------------------------------
    def sto(self, name: str, value: Union[int, float]) -> float:
        """Armazena um valor em uma variável (A, B, C, X, Y, M)."""
        var_name = name.strip().upper()
        self.variables[var_name] = float(value)
        if var_name == 'M':
            self.memory = float(value)
        return float(value)

    def rcl(self, name: str) -> float:
        """Resgata o valor de uma variável."""
        var_name = name.strip().upper()
        if var_name == 'M':
            return self.memory
        return self.variables.get(var_name, 0.0)

    def m_plus(self, val: Union[int, float]) -> float:
        """Adiciona à memória (M+)."""
        self.memory += float(val)
        self.variables['M'] = self.memory
        return self.memory

    def m_minus(self, val: Union[int, float]) -> float:
        """Subtrai da memória (M-)."""
        self.memory -= float(val)
        self.variables['M'] = self.memory
        return self.memory

    def m_recall(self) -> float:
        """Retorna o valor da memória (MR)."""
        return self.memory

    def m_clear(self) -> float:
        """Limpa a memória (MC)."""
        self.memory = 0.0
        self.variables['M'] = 0.0
        return 0.0

    # ---------------------------------------------------------
    # Dicionário de Funções e Constantes no Escopo AST
    # ---------------------------------------------------------
    def get_math_scope(self) -> Dict[str, Any]:
        """Gera o escopo matemático disponível para avaliação de expressões."""
        return {
            # Constantes
            'pi': math.pi,
            'PI': math.pi,
            'π': math.pi,
            'e': math.e,
            'E': math.e,
            'tau': math.tau,
            'TAU': math.tau,
            'inf': math.inf,
            # Último resultado e variáveis
            'Ans': self.ans,
            'ans': self.ans,
            'ANS': self.ans,
            **self.variables,
            # Operações e funções trigonométricas com modo angular
            'sin': self.sin,
            'cos': self.cos,
            'tan': self.tan,
            'asin': self.asin,
            'acos': self.acos,
            'atan': self.atan,
            'atan2': self.atan2,
            # Hiperbólicas
            'sinh': self.sinh,
            'cosh': self.cosh,
            'tanh': self.tanh,
            'asinh': self.asinh,
            'acosh': self.acosh,
            'atanh': self.atanh,
            # Raízes e potências
            'sqrt': self.square_root,
            'cbrt': self.cube_root,
            'pow': pow,
            # Logaritmos e exponencial
            'ln': self.ln,
            'log': lambda x, base=10: math.log(x, base) if base != 10 else math.log10(x),
            'log10': self.log10,
            'log2': self.log2,
            'exp': self.exp,
            # Outros utilitários
            'factorial': self.factorial,
            'fact': self.factorial,
            'abs': abs,
            'round': round,
            'nCr': self.nCr,
            'comb': self.nCr,
            'nPr': self.nPr,
            'perm': self.nPr,
            # Estatística
            'mean': self.mean,
            'median': self.median,
            'std': self.std,
            'stdev': self.std,
            'variance': self.variance,
            'var': self.variance,
            'sum': self.stats_sum,
            'min': min,
            'max': max,
            # Memória
            'sto': self.sto,
            'rcl': self.rcl,
            'm_plus': self.m_plus,
            'm_minus': self.m_minus,
            'm_recall': self.m_recall,
            'm_clear': self.m_clear,
        }

    # ---------------------------------------------------------
    # Pré-processamento Inteligente de Expressões
    # ---------------------------------------------------------
    def preprocess_expression(self, expr: str) -> str:
        """
        Normaliza símbolos tipográficos, converte notações como fatorial (!),
        substitui variáveis / Ans e insere multiplicação implícita.
        """
        expr = expr.strip()
        if not expr:
            return '0'

        # 1. Normaliza operadores visuais para sintaxe Python
        expr = expr.replace('×', '*').replace('÷', '/').replace('^', '**')
        expr = expr.replace('²', '**2').replace('³', '**3')
        expr = expr.replace('π', 'pi')

        # 2. Notação científica: ex. "2.5 EE 3" ou "2.5EE3" -> "2.5e3"
        expr = re.sub(r'(\d+(?:\.\d+)?)\s*(?:EE|EXP)\s*([+-]?\d+)', r'\1e\2', expr, flags=re.IGNORECASE)

        # 3. Notação de Fatorial postfix: 5! -> factorial(5), (2+3)! -> factorial((2+3))
        # Loop para suportar expressões aninhadas e múltiplos fatoriais
        while '!' in expr and not ('!=' in expr or '!==' in expr):
            new_expr = re.sub(
                r'(\((?:[^()]+|\([^()]*\))*\)|\b\d+(?:\.\d+)?|[a-zA-Z_]\w*)!',
                r'factorial(\1)',
                expr
            )
            if new_expr == expr:
                break
            expr = new_expr

        # 4. Multiplicação implícita
        # Caso: número seguido de parêntese: 2(3) -> 2*(3) (sem quebrar nomes como log10(x))
        expr = re.sub(r'(?<![\w.])(\d+(?:\.\d+)?)\s*\(', r'\1*(', expr)
        # Caso: fecha parêntese seguido de abre parêntese: (2)(3) -> (2)*(3)
        expr = re.sub(r'\)\s*\(', r')*(', expr)
        # Caso: fecha parêntese seguido de número: (2)3 -> (2)*3
        expr = re.sub(r'\)\s*(\d+(?:\.\d+)?)', r')*\1', expr)
        # Caso: número seguido de constante pi/e ou função: 2pi -> 2*pi, 3sin(x) -> 3*sin(x)
        # Evita interferir com notação científica como 1e5 ou 2e-3
        expr = re.sub(
            r'(?<![\w.])(\d+(?:\.\d+)?)\s*([a-df-zA-DF-Z_]\w*|e(?![+-]?\d))\b',
            r'\1*\2',
            expr
        )
        # Caso: fecha parêntese seguido de identificador: )pi -> )*pi
        expr = re.sub(r'\)\s*([a-zA-Z_]\w*)', r')*\1', expr)

        return expr

    # ---------------------------------------------------------
    # Avaliação Segura via Árvore Sintática (AST)
    # ---------------------------------------------------------
    def evaluate(self, expression: str) -> Union[int, float]:
        """
        Avalia expressões matemáticas completas com segurança respeitando a
        hierarquia dos operadores matemáticos e funções científicas.
        """
        raw_expr = expression.strip()
        if not raw_expr:
            return 0

        # Tratamento de atribuição de variável via CLI: STO A 50 ou A = 50
        sto_match = re.match(r'^(?:STO\s+)?([a-zA-Z])\s*=\s*(.+)$', raw_expr, re.IGNORECASE)
        if sto_match:
            var_name = sto_match.group(1).upper()
            val_to_eval = sto_match.group(2)
            val = self.evaluate(val_to_eval)
            self.sto(var_name, val)
            self.ans = val
            return val

        # Tratamento de comando MODE: "MODE DEG", "MODE RAD", "MODE GRAD"
        mode_match = re.match(r'^MODE\s+(DEG|RAD|GRAD)$', raw_expr, re.IGNORECASE)
        if mode_match:
            new_mode = self.set_angle_mode(mode_match.group(1))
            return 0

        processed_expr = self.preprocess_expression(raw_expr)

        try:
            tree = ast.parse(processed_expr, mode='eval')
            math_scope = self.get_math_scope()
            result = self._eval_node(tree.body, math_scope)

            # Armazena último resultado calculado (Ans)
            self.ans = result

            # Armazena no histórico interno
            self.history.append({
                'expression': raw_expr,
                'processed': processed_expr,
                'result': result,
                'mode': self.angle_mode,
            })

            # Converte números inteiros matemáticos para tipo int
            if isinstance(result, float) and result.is_integer():
                return int(result)
            return result
        except ZeroDivisionError as zde:
            raise ZeroDivisionError("ZeroDivisionError: division by zero") from zde
        except ValueError as ve:
            raise ValueError(f"ValueError: {str(ve)}") from ve
        except Exception as e:
            raise ValueError(f"SyntaxError: {str(e)}") from e

    def _eval_node(self, node: ast.AST, scope: Dict[str, Any]) -> Any:
        """Avalia nós individuais da árvore AST de forma recursiva e segura."""
        if isinstance(node, ast.Constant):  # Python 3.8+ (números e literais)
            return node.value
        elif isinstance(node, ast.BinOp):
            op_type = type(node.op)
            if op_type not in self.SUPPORTED_OPERATORS:
                raise TypeError(f"Operador binário não suportado: {op_type.__name__}")
            left = self._eval_node(node.left, scope)
            right = self._eval_node(node.right, scope)
            if op_type in (ast.Div, ast.FloorDiv, ast.Mod) and right == 0:
                raise ZeroDivisionError("division by zero")
            return self.SUPPORTED_OPERATORS[op_type](left, right)
        elif isinstance(node, ast.UnaryOp):
            op_type = type(node.op)
            if op_type not in self.SUPPORTED_OPERATORS:
                raise TypeError(f"Operador unário não suportado: {op_type.__name__}")
            operand = self._eval_node(node.operand, scope)
            return self.SUPPORTED_OPERATORS[op_type](operand)
        elif isinstance(node, ast.Call):
            func_name = ''
            if isinstance(node.func, ast.Name):
                func_name = node.func.id
            elif isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                func_name = node.func.attr

            if func_name in scope and callable(scope[func_name]):
                args = [self._eval_node(arg, scope) for arg in node.args]
                return scope[func_name](*args)
            raise NameError(f"Função '{func_name}' não é permitida ou não existe.")
        elif isinstance(node, ast.Name):
            if node.id in scope:
                return scope[node.id]
            raise NameError(f"Variável ou identificador '{node.id}' não definido.")
        elif isinstance(node, ast.List):
            # Permite listas para funções estatísticas: mean([1, 2, 3])
            return [self._eval_node(elt, scope) for elt in node.elts]
        elif isinstance(node, ast.Tuple):
            return tuple(self._eval_node(elt, scope) for elt in node.elts)
        else:
            raise TypeError(f"Expressão ou comando não suportado: {type(node).__name__}")


def main() -> None:
    """Interface CLI interativa quando executado com 'python3 calculator.py'."""
    calc = PythonCalculator(angle_mode='DEG')
    print("================================================================")
    print("  PyCalc Studio - Calculadora Científica em Python v3.12        ")
    print("================================================================")
    print("Modo Angular atual: DEG (Graus) | Comandos: 'MODE RAD', 'MODE GRAD'")
    print("Funções disponíveis: sin, cos, tan, asin, acos, atan, sinh, cosh,")
    print("                     sqrt, cbrt, ln, log, exp, 5!, nCr, nPr,")
    print("                     mean, std, median, sum, pi, e, Ans, STO, RCL.")
    print("Exemplos: 'sin(30)', '2pi', '5!', '(2+3)*4', 'mean(10, 20, 30)', '1.5e3'")
    print("Digite 'sair' ou 'exit' para encerrar.\n")

    if len(sys.argv) > 1:
        expr = " ".join(sys.argv[1:])
        try:
            res = calc.evaluate(expr)
            print(f">>> {expr}")
            print(f"Resultado: {res}")
        except Exception as e:
            print(f"Erro: {e}")
        return

    while True:
        try:
            prompt = f"pycalc [{calc.angle_mode}] >>> "
            user_input = input(prompt).strip()
            if not user_input:
                continue
            if user_input.lower() in ('sair', 'exit', 'quit', 'q'):
                print("Encerrando PyCalc Studio. Até logo!")
                break
            res = calc.evaluate(user_input)
            print(f"Out: {res}")
        except (KeyboardInterrupt, EOFError):
            print("\nSessão encerrada.")
            break
        except Exception as err:
            print(f"Erro: {err}")


if __name__ == '__main__':
    main()
