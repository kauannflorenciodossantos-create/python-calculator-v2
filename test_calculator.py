#!/usr/bin/env python3
"""
Testes Unitários Abrangentes para a Calculadora Científica (PyCalc Studio)
"""

import math
import unittest
from calculator import PythonCalculator


class TestPythonScientificCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = PythonCalculator(angle_mode='DEG')

    # 1. Operações Básicas e Precedência
    def test_basic_addition(self):
        self.assertEqual(self.calc.evaluate("15 + 30"), 45)
        self.assertEqual(self.calc.evaluate("0.1 + 0.2"), 0.30000000000000004)

    def test_subtraction(self):
        self.assertEqual(self.calc.evaluate("100 - 35"), 65)
        self.assertEqual(self.calc.evaluate("-5 - 10"), -15)

    def test_multiplication(self):
        self.assertEqual(self.calc.evaluate("12 * 8"), 96)
        self.assertEqual(self.calc.evaluate("2.5 * 4"), 10)

    def test_division(self):
        self.assertEqual(self.calc.evaluate("100 / 4"), 25)
        self.assertEqual(self.calc.evaluate("7 / 2"), 3.5)

    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            self.calc.evaluate("50 / 0")

    def test_integer_division(self):
        self.assertEqual(self.calc.evaluate("17 // 3"), 5)

    def test_power(self):
        self.assertEqual(self.calc.evaluate("2 ** 10"), 1024)
        self.assertEqual(self.calc.evaluate("5 ** 3"), 125)
        self.assertEqual(self.calc.evaluate("2 ^ 8"), 256)

    def test_modulo(self):
        self.assertEqual(self.calc.evaluate("29 % 5"), 4)

    def test_sqrt_and_cbrt(self):
        self.assertEqual(self.calc.evaluate("sqrt(144)"), 12)
        self.assertEqual(self.calc.evaluate("sqrt(2)"), 1.4142135623730951)
        self.assertEqual(self.calc.evaluate("cbrt(27)"), 3)

    def test_complex_precedence_and_parentheses(self):
        self.assertEqual(self.calc.evaluate("2 + 3 * 4"), 14)
        self.assertEqual(self.calc.evaluate("(2 + 3) * 4"), 20)
        self.assertEqual(self.calc.evaluate("100 // 5 + 2 ** 3"), 28)
        self.assertEqual(self.calc.evaluate("((2 + 3) * (10 - 6)) / 4"), 5)

    # 2. Multiplicação Implícita
    def test_implicit_multiplication(self):
        self.assertEqual(self.calc.evaluate("2(3 + 4)"), 14)
        self.assertEqual(self.calc.evaluate("(2)(5)"), 10)
        self.assertAlmostEqual(self.calc.evaluate("2pi"), 2 * math.pi)
        self.assertEqual(self.calc.evaluate("3sin(90)"), 3)

    # 3. Trigonometria e Modos Angulares (DEG / RAD / GRAD)
    def test_trigonometry_deg(self):
        self.calc.set_angle_mode('DEG')
        self.assertAlmostEqual(self.calc.evaluate("sin(30)"), 0.5, places=6)
        self.assertAlmostEqual(self.calc.evaluate("cos(60)"), 0.5, places=6)
        self.assertAlmostEqual(self.calc.evaluate("tan(45)"), 1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("asin(0.5)"), 30.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("acos(0.5)"), 60.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("atan(1)"), 45.0, places=6)

    def test_trigonometry_rad(self):
        self.calc.set_angle_mode('RAD')
        self.assertAlmostEqual(self.calc.evaluate("sin(pi / 2)"), 1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("cos(pi)"), -1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("tan(pi / 4)"), 1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("asin(1)"), math.pi / 2, places=6)

    def test_trigonometry_grad(self):
        self.calc.set_angle_mode('GRAD')
        self.assertAlmostEqual(self.calc.evaluate("sin(100)"), 1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("cos(200)"), -1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("tan(50)"), 1.0, places=6)
        self.assertAlmostEqual(self.calc.evaluate("asin(1)"), 100.0, places=6)

    # 4. Constantes e Fatorial
    def test_constants(self):
        self.assertAlmostEqual(self.calc.evaluate("pi"), math.pi)
        self.assertAlmostEqual(self.calc.evaluate("e"), math.e)
        self.assertAlmostEqual(self.calc.evaluate("tau"), math.tau)

    def test_factorial(self):
        self.assertEqual(self.calc.evaluate("5!"), 120)
        self.assertEqual(self.calc.evaluate("0!"), 1)
        self.assertEqual(self.calc.evaluate("(3 + 2)!"), 120)
        self.assertEqual(self.calc.evaluate("factorial(6)"), 720)
        self.assertEqual(self.calc.evaluate("3! + 4!"), 30)

    # 5. Logaritmos e Exponenciais
    def test_logarithms(self):
        self.assertEqual(self.calc.evaluate("log10(1000)"), 3)
        self.assertEqual(self.calc.evaluate("log(100)"), 2)
        self.assertAlmostEqual(self.calc.evaluate("ln(e)"), 1.0)
        self.assertEqual(self.calc.evaluate("log2(64)"), 6)
        self.assertAlmostEqual(self.calc.evaluate("exp(1)"), math.e)

    # 6. Memória, Ans e Variáveis
    def test_memory_and_ans(self):
        res1 = self.calc.evaluate("50 * 2")
        self.assertEqual(res1, 100)
        self.assertEqual(self.calc.evaluate("Ans + 25"), 125)

        # M+, MR, MC
        self.calc.m_clear()
        self.calc.m_plus(50)
        self.calc.m_plus(20)
        self.assertEqual(self.calc.m_recall(), 70)
        self.calc.m_minus(15)
        self.assertEqual(self.calc.m_recall(), 55)
        self.calc.m_clear()
        self.assertEqual(self.calc.m_recall(), 0)

        # Variáveis STO / RCL
        self.calc.sto('A', 84)
        self.assertEqual(self.calc.rcl('A'), 84)
        self.assertEqual(self.calc.evaluate("A / 2"), 42)

    # 7. Notação Científica
    def test_scientific_notation(self):
        self.assertEqual(self.calc.evaluate("1.5e3"), 1500)
        self.assertEqual(self.calc.evaluate("2.5E-2"), 0.025)
        self.assertEqual(self.calc.evaluate("2 EE 4"), 20000)

    # 8. Estatística e Combinatória
    def test_statistics(self):
        self.assertEqual(self.calc.evaluate("mean(10, 20, 30)"), 20)
        self.assertEqual(self.calc.evaluate("mean([2, 4, 6, 8])"), 5)
        self.assertEqual(self.calc.evaluate("median(1, 5, 2, 8, 7)"), 5)
        self.assertEqual(self.calc.evaluate("sum(10, 20, 30, 40)"), 100)
        self.assertEqual(self.calc.evaluate("nCr(5, 2)"), 10)
        self.assertEqual(self.calc.evaluate("nPr(5, 2)"), 20)


if __name__ == '__main__':
    unittest.main()
