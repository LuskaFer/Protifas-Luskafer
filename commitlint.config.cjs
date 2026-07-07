// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ Nova funcionalidade
        'fix', // 🐛 Correção de bug
        'docs', // 📚 Documentação
        'style', // 💄 Formatação/estilo (não afeta código)
        'refac', // ♻️ Refatoração
        'perf', // ⚡ Performance
        'test', // ✅ Testes
        'build', // 🏗️ Build/dependências
        'ci', // 👷 CI/CD
        'chore', // 🔧 Tarefas gerais
        'revert', // ⏪ Revert
        'wip', // 🚧 Work in progress
        'types', // 🎯 Tipagem TypeScript
      ],
    ],

    // Escopo (opcional - descomente se quiser restringir)
    // 'scope-enum': [2, 'always', ['auth', 'landing', 'dashboard', 'ui', 'api', 'routes']],
    'scope-case': [2, 'always', 'lower-case'],

    // Tamanho do header
    'header-max-length': [2, 'always', 100],

    // Case rules
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [0], // Permite maiúscula/minúscula no assunto

    // Corpo e footer (aumentado para evitar erros)
    'body-max-line-length': [2, 'always', 300],
    'footer-max-line-length': [2, 'always', 300],

    // Regras de formato
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
}
