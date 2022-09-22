import {FullMetadata} from 'package-json'

export const messageInfo = (dep: FullMetadata): string => {
  return `| ${dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name} | |
| Description | ${dep.description} |
| Version | ${dep.version} |
| License | ${dep.license} |
| NPM | [${dep.name}](https://www.npmjs.com/package/${dep.name} |`
}
