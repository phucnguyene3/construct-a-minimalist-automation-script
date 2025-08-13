// p1mf_construct_a_min.js

// Token types
const TOKEN_KEYWORD = 'KEYWORD';
const TOKEN_IDENTIFIER = 'IDENTIFIER';
const TOKEN_NUMBER = 'NUMBER';
const TOKEN_OPERATOR = 'OPERATOR';
const TOKEN_EOF = 'EOF';

// Keywords
const keywords = new Set(['if', 'then', 'else', 'while', 'do']);

// Tokenizer
class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  tokenize() {
    const tokens = [];
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (char === ' ') {
        this.position++;
        continue;
      }
      if (char >= '0' && char <= '9') {
        tokens.push(this.tokenizeNumber());
      } else if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
        tokens.push(this.tokenizeIdentifier());
      } else if (char === '+' || char === '-' || char === '*' || char === '/') {
        tokens.push(new Token(TOKEN_OPERATOR, char));
        this.position++;
      } else {
        throw new Error(`Unexpected character: ${char}`);
      }
    }
    tokens.push(new Token(TOKEN_EOF, 'EOF'));
    return tokens;
  }

  tokenizeNumber() {
    let value = '';
    while (this.position < this.input.length && this.input[this.position] >= '0' && this.input[this.position] <= '9') {
      value += this.input[this.position];
      this.position++;
    }
    return new Token(TOKEN_NUMBER, parseInt(value));
  }

  tokenizeIdentifier() {
    let value = '';
    while (this.position < this.input.length && (this.input[this.position] >= 'a' && this.input[this.position] <= 'z' || this.input[this.position] >= 'A' && this.input[this.position] <= 'Z')) {
      value += this.input[this.position];
      this.position++;
    }
    if (keywords.has(value)) {
      return new Token(TOKEN_KEYWORD, value);
    } else {
      return new Token(TOKEN_IDENTIFIER, value);
    }
  }
}

// Parser
class ASTNode {
  constructor(type, children) {
    this.type = type;
    this.children = children;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    return this.parseExpression();
  }

  parseExpression() {
    const node = new ASTNode('expression', []);
    while (this.position < this.tokens.length && this.tokens[this.position].type !== TOKEN_EOF) {
      node.children.push(this.parseTerm());
    }
    return node;
  }

  parseTerm() {
    if (this.tokens[this.position].type === TOKEN_NUMBER) {
      return this.parseFactor();
    } else if (this.tokens[this.position].type === TOKEN_IDENTIFIER) {
      return this.parseIdentifier();
    } else {
      throw new Error(`Unexpected token: ${this.tokens[this.position]}`);
    }
  }

  parseFactor() {
    const node = new ASTNode('factor', [this.tokens[this.position]]);
    this.position++;
    return node;
  }

  parseIdentifier() {
    const node = new ASTNode('identifier', [this.tokens[this.position]]);
    this.position++;
    return node;
  }
}

// Runner
class Runner {
  constructor(ast) {
    this.ast = ast;
  }

  run() {
    this.visit(this.ast);
  }

  visit(node) {
    if (node.type === 'expression') {
      node.children.forEach(child => this.visit(child));
    } else if (node.type === 'factor') {
      console.log(`Factor: ${node.children[0].value}`);
    } else if (node.type === 'identifier') {
      console.log(`Identifier: ${node.children[0].value}`);
    }
  }
}

// Usage
const input = '2 + 3 * 4';
const tokenizer = new Tokenizer(input);
const tokens = tokenizer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();
const runner = new Runner(ast);
runner.run();