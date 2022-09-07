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

  core.debug(JSON.stringify({listDependencies}, null, 2))

  // // fetch information for all dependencies to render
  const info: Record<string, FullMetadata> = {}
  for (const dependency of listDependencies) {
    try {
      info[dependency] = await packageJson(dependency, {fullMetadata: true})
    } catch (error) {
      debug(`Package not found: ${dependency}`)
    }
  }

  core.debug(JSON.stringify({info}, null, 2))

  const dependenciesMessage = `
## Dependencies added
${newDependencies.dependencies.map(dep => messageInfo(info[dep])).join(`\n`)}
`
  core.debug(JSON.stringify({dependenciesMessage}, null, 2))

  const devDependenciesMessage = `
## Development dependencies added
${newDependencies.devDependencies.map(dep => messageInfo(info[dep])).join(`\n`)}
`
  core.debug(JSON.stringify({devDependenciesMessage}, null, 2))

  const updatedDependenciesMessage = `
## Dependencies updated
${updatedDependencies.dependencies
  .map(dep => messageInfo(info[dep]))
  .join(`\n`)}
`
  core.debug(JSON.stringify({updatedDependenciesMessage}, null, 2))

  const updatedDevDependenciesMessage = `
## Development dependencies updated
${updatedDependencies.devDependencies
  .map(dep => messageInfo(info[dep]))
  .join(`\n`)}
`
  core.debug(JSON.stringify({updatedDevDependenciesMessage}, null, 2))

  return compact([
    COMMENT_IDENTIFIER,
    newDependencies.dependencies.length && dependenciesMessage,
    newDependencies.devDependencies.length && devDependenciesMessage,
    updatedDependencies.dependencies.length && updatedDependenciesMessage,
    updatedDependencies.devDependencies.length && updatedDevDependenciesMessage
  ]).join(`\n`)
}

export default draftMessage
