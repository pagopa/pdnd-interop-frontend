import type { UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 200],
    'type-enum': [
      1,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'test',
        'style',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    'header-match-pattern': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'header-match-pattern': (parsed) => {
          const { header } = parsed
          const pattern =
            /^(feat|fix|docs|chore|refactor|test|style|perf|ci|build|revert): .+ \([A-Z]+-\d+(, [A-Z]+-\d+)*\)$/

          if (!header || !pattern.test(header)) {
            return [false, 'Message should follow the format: <type>: <description> (<JIRA-KEY>)']
          }

          return [true]
        },
      },
    },
  ],
}

export default Configuration
