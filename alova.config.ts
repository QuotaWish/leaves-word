module.exports = {
  generator: [
    {
      input: 'http://localhost:8101/api/v2/api-docs',
      platform: 'swagger',
      output: 'apps/view/src/composables/api/clients',
      global: 'Apis',
    },
  ],
  autoUpdate: {
    launchEditor: true,
    interval: 5 * 60 * 1000
  }
};