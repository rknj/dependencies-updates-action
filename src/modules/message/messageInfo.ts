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
<table>
    ${row('Description', dep.description)}
    ${row('Author', dep.author?.name)}
    ${row('License', dep.license)}
    ${row(
      'Contributors',
      dep.contributors?.map(contributor => contributor.name).join(', ')
    )}    
    ${row('Created on', dep.time?.created)}
    ${row('Last modified', dep.time?.modified)}
</table>
    `
}

const row = (title: string, field: string = ''): string => {
  return `
    ${field ? `<tr><td>${title}</td><td>${field}</td></tr>` : ``}
    `
}
