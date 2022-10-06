import {FullMetadata} from 'package-json'

export const messageInfo = (dep: FullMetadata): string => {
  return `| [${dep.name}](https://www.npmjs.com/package/${dep.name}) | ${
    dep.description
  } | ${dep.version} | ${dep.license} | ${
    dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name
  } |`
}
