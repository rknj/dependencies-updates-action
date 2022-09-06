import {debug} from '@actions/core'
import {compact} from 'lodash/fp'
import packageJson, {FullMetadata} from 'package-json'
import {COMMENT_IDENTIFIER} from '../../config/comment'
import {DependenciesList} from '../../types/package'
import {messageInfo} from './messageInfo'
import * as core from '@actions/core'

async function draftMessage(
  newDependencies: DependenciesList,
  updatedDependencies: DependenciesList
): Promise<string> {
  // list all dependencies to render
  const listDependencies = [
    ...newDependencies.dependencies,
    ...newDependencies.devDependencies,
    ...updatedDependencies.dependencies,
    ...updatedDependencies.devDependencies
  ]

  core.debug(JSON.stringify({newDependencies, updatedDependencies}, null, 2))

  // // fetch information for all dependencies to render
  const info: Record<string, FullMetadata> = {}
  for (const dependency of listDependencies) {
    try {
      info[dependency] = await packageJson(dependency, {fullMetadata: true})
    } catch (error) {
      debug(`Package not found: ${dependency}`)
    }
  }

  const dependenciesMessage = `
## Dependencies added
${newDependencies.dependencies.map(dep => messageInfo(info[dep])).join(`\n`)}
`

  const devDependenciesMessage = `
## Development dependencies added
${newDependencies.devDependencies.map(dep => messageInfo(info[dep])).join(`\n`)}
`

  const updatedDependenciesMessage = `
## Dependencies updated
${updatedDependencies.dependencies
  .map(dep => messageInfo(info[dep]))
  .join(`\n`)}
`

  const updatedDevDependenciesMessage = `
## Development dependencies updated
${updatedDependencies.devDependencies
  .map(dep => messageInfo(info[dep]))
  .join(`\n`)}
`

  return compact([
    COMMENT_IDENTIFIER,
    newDependencies.dependencies.length && dependenciesMessage,
    newDependencies.devDependencies.length && devDependenciesMessage,
    updatedDependencies.dependencies.length && updatedDependenciesMessage,
    updatedDependencies.devDependencies.length && updatedDevDependenciesMessage
  ]).join(`\n`)
}

export default draftMessage
