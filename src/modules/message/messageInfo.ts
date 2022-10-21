import {FullMetadata} from 'package-json'
import {PACKAGE_BASE_URL} from '../../config/message'

export const messageInfo = (type: String, dep: FullMetadata): string => {
  return `| [${dep.name}](${PACKAGE_BASE_URL}${dep.name}) (${type}) | ${
    dep.description
  } | ${dep.version} | ${dep.license} | ${
    dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name
  } |`
}
