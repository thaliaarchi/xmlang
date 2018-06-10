# XMLang

XMLang is a functional language with XML syntax interpreted using JSX.

# Operators

## Assignment

| Op      | JS         | Description         |
|---------|------------|---------------------|
| `func`  | `function` | Function            |
| `def`   | `let`      | Definition          |
| `const` | `const`    | Constant definition |
| TBD     | `=`        | Assignment          |

## Arithmetic

**Binary operators:**

| Op     | JS   | Description    |
|--------|------|----------------|
| `add`  | `+`  | Addition       |
| `sub`  | `-`  | Subtraction    |
| `mul`  | `*`  | Multiplication |
| `div`  | `/`  | Division       |
| `mod`  | `%`  | Modulo         |
| `exp`  | `**` | Exponentiation |
| `root` |      | Root           |

**Unary operators:**

| Op     | JS          | Description    |
|--------|-------------|----------------|
| `num`  | `+`         | Cast to number |
| `neg`  | `-`         | Negation       |
| `abs`  | `Math.abs`  | Absolute value |
| `sin`  | `Math.sin`  | Sine           |
| `cos`  | `Math.cos`  | Cosine         |
| `tan`  | `Math.tan`  | Tangent        |
| `asin` | `Math.asin` | Arc sine       |
| `acos` | `Math.acos` | Arc cosine     |
| `atan` | `Math.atan` | Arc tangent    |

## Comparison

| Op    | JS   | Description           |
|-------|------|-----------------------|
| `eq`  | `==` | Equal                 |
| `neq` | `!=` | Not equal             |
| `gt`  | `>`  | Greater than          |
| `lt`  | `<`  | Less than             |
| `gte` | `>=` | Greater than or equal |
| `lte` | `<=` | Less than or equal    |

## Logical

| Op    | JS   | Description |
|-------|------|-------------|
| `not` | `!`  | Logical not |
| `and` | `&&` | Logical and |
| `or`  | `||` | Logical or  |

## Conditional

| Op     | JS       | Description  |
|--------|----------|--------------|
| `if`   | `? :`    | If statement |
| `cond` | `switch` | Conditional  |
| `case` | `case`   | Case         |

## Comma

,
comma operator

## Bitwise

| Op     | JS   | Description  |
|--------|------|--------------|
| `band` | `&`  | Bitwise and  |
| `bor`  | `|`  | Bitwise or   |
| `xor`  | `^`  | Exclusive or |
| `comp` | `~`  | Complement   |
| `lsh`  | `<<` | Left shift   |
| `rsh`  | `>>` | Right shift  |

# Data Types

List, map, set

Each, map

# Utilities

| Func    | JS            | Description |
|---------|---------------|-------------|
| `print` | `console.log` | Print       |