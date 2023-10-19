module.exports = {
  preset: 'ts-jest', // preajuste para manejar archivos typescript
  testEnvironment: 'node', // Especifica el entorno de ejecución donde se ejecutan las pruebas (Node.js)
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Define las extensiones de archivo que jest deberia considerar
  transform: {
    // Especifica cómo transformar los archivos antes de testearlos ( la transformación se hace javascript)
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$', // test.ts .test.tsx .spec.ts .spec.tsx
  collectCoverage: true, // habilitamos la recopilación de información de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    // "/path/to/ignore"
  ],
};