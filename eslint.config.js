// Configuración mínima de ESLint (config flat, ESLint 10+).
// Reglas recomendadas de ESLint + globals de Node.js para el servidor
// y de navegador para los scripts del front-end.
//
// Uso:  npx eslint .      (o agregar un script "lint")

import js from "@eslint/js";

const globalsNode = {
    process: "readonly",
    console: "readonly",
    Buffer: "readonly",
    fetch: "readonly",
    URL: "readonly",
    URLSearchParams: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
    structuredClone: "readonly"
};

const globalsNavegador = {
    window: "readonly",
    document: "readonly",
    console: "readonly",
    alert: "readonly",
    confirm: "readonly",
    fetch: "readonly",
    location: "readonly",
    localStorage: "readonly",
    FormData: "readonly",
    encodeURIComponent: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    JSON: "readonly"
};

export default [
    {
        ignores: ["node_modules/**"]
    },
    js.configs.recommended,
    {
        // Código del servidor: index.js, config, controllers, models, routes,
        // validation, ErrorControl, tests y scripts sueltos de prueba.
        files: ["*.js", "config/**/*.js", "controllers/**/*.js", "models/**/*.js", "routes/**/*.js", "validation/**/*.js", "ErrorControl/**/*.js", "tests/**/*.js", "testFiles/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globalsNode
        },
        rules: {
            // Prefijo `_` para parámetros que Express exige aunque no se usen
            // (por ejemplo el `next` del manejador central de errores).
            "no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }]
        }
    },
    {
        // Scripts que corre el navegador.
        files: ["static/js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globalsNavegador
        }
    }
];
