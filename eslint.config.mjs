// 导入TypeScript ESLint插件和解析器
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [{
    files: ["**/*.ts"],
}, {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: "module",
    },

    rules: {
        // 命名规范检查
        "@typescript-eslint/naming-convention": ["warn", {
            selector: "import",
            format: ["camelCase", "PascalCase"],
        }],

        // 强制使用花括号
        curly: "warn",
        // 强制使用严格相等
        eqeqeq: "warn",
        // 禁止抛出字面量
        "no-throw-literal": "warn",
        // 强制使用分号
        semi: "warn",
    },
}];