import type { Command } from '../../commands.js'

const apiSetup = {
  aliases: ['api-setup', 'setup-api', 'configure-api'],
  type: 'local-jsx',
  name: 'api-setup',
  description: 'Configure API credentials for AceData Cloud',
  load: () => import('./api-setup.js'),
} satisfies Command

export default apiSetup
