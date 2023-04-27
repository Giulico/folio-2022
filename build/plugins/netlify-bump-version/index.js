function netlifyUpdateVersion() {
  return {
    async onPreBuild(props) {
      const { utils, packageJson } = props

      await utils.run.command('pnpm semantic-release')

      utils.status.show({
        title: 'Bump Version plugin (netlify-bump-version)',
        summary: '👩‍💻  Semantic release has analyzed previous commits',
        text: `Based on commit history semantic release has upgraded the version in package.json, create a new tag and push everything up to remote (${packageJson.repository.url}). Whenever semantic release can't find relevant changes, it neither upgrade version nor push to remote.`
      })
    }
  }
}

// eslint-disable-next-line no-undef
module.exports = netlifyUpdateVersion
