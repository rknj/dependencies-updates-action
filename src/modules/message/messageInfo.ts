import {FullMetadata} from 'package-json'

export const messageInfo = (type: String, dep: FullMetadata): string => {
  return `| [${dep.name}](https://www.npmjs.com/package/${
    dep.name
  }) (${type}) | ${dep.description} | ${dep.version} | ${dep.license} | ${
    dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name
  } |`
}
