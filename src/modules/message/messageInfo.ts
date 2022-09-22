import {FullMetadata} from 'package-json'

export const messageInfo = (dep: FullMetadata): string => {
  return `\n| [${dep.name}](https://www.npmjs.com/package/${dep.name}) | |
| Description | ${dep.description} |
| Version | ${dep.version} |
| License | ${dep.license} |
| Source | ${dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name} |`
}
