import {FullMetadata} from 'package-json'

export const messageInfo = (dep: FullMetadata): string => {
  return `
${header(dep)}

${table(dep)}

${
  dep.readme
    ? `<details><summary>README.md</summary>${dep.readme}</details> `
    : ``
}
`
}

const header = (dep: FullMetadata): string => {
  return `
### ${dep.homepage ? `[${dep.name}](${dep.homepage})` : dep.name}

`
}

const table = (dep: FullMetadata): string => {
  return `
| Description | ${dep.description} |
| Author | ${dep.author?.name} |
| License | ${dep.license} |
| Contributors | ${dep.contributors
    ?.map(contributor => contributor.name)
    .join(', ')} |
| Created on | ${dep.time?.created} |
| Last modified | ${dep.time?.modified} |
`
}
