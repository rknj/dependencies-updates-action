import {debug} from '@actions/core'
import {compact} from 'lodash/fp'
import packageJson, {FullMetadata} from 'package-json'
import {COMMENT_IDENTIFIER} from '../../config/comment'
import {DependenciesList} from '../../types/package'
import {messageInfo} from './messageInfo'
import * as core from '@actions/core'
import {
  COMMENT_TABLE_LINE,
  DEPENDENCY_COMMENT_TABLE_HEADER,
  DEVDEPENDENCY_COMMENT_TABLE_HEADER
} from '../../config/message'

async function draftMessage(
  newDependencies: DependenciesList,
  updatedDependencies: DependenciesList,
  removedDependencies: DependenciesList,
  showDevDependencies: string,
  showChecklist: string
): Promise<string> {
  // list all dependencies to render
  const listDependencies = [
    ...newDependencies.dependencies,
    ...newDependencies.devDependencies,
    ...updatedDependencies.dependencies,
    ...updatedDependencies.devDependencies,
    ...removedDependencies.dependencies,
    ...removedDependencies.devDependencies
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

  const dependenciesMessage = `${newDependencies.dependencies
    .map(dep => messageInfo('Added', info[dep]))
    .join(`\n`)}`
  core.debug(JSON.stringify({dependenciesMessage}, null, 2))

  const updatedDependenciesMessage = `${updatedDependencies.dependencies
    .map(dep => messageInfo('Updated', info[dep]))
    .join(`\n`)}`
  core.debug(JSON.stringify({updatedDependenciesMessage}, null, 2))

  const removedDependenciesMessage = `${removedDependencies.dependencies
    .map(dep => messageInfo('Removed', info[dep]))
    .join(`\n`)}`
  core.debug(JSON.stringify({removedDependenciesMessage}, null, 2))

  let devMessage = ''
  const hasUpdatedDevDependencies =
    newDependencies?.devDependencies.length ||
    updatedDependencies?.devDependencies.length ||
    removedDependencies?.devDependencies.length
  if (showDevDependencies === 'true' && hasUpdatedDevDependencies) {
    const devDependenciesMessage = `${newDependencies.devDependencies
      .map(dep => messageInfo('Added', info[dep]))
      .join(`\n`)}`
    core.debug(JSON.stringify({devDependenciesMessage}, null, 2))

    const updatedDevDependenciesMessage = `${updatedDependencies.devDependencies
      .map(dep => messageInfo('Updated', info[dep]))
      .join(`\n`)}`
    core.debug(JSON.stringify({updatedDevDependenciesMessage}, null, 2))

    const removedDevDependenciesMessage = `${removedDependencies.devDependencies
      .map(dep => messageInfo('Removed', info[dep]))
      .join(`\n`)}`
    core.debug(JSON.stringify({removedDevDependenciesMessage}, null, 2))

    devMessage = compact([
      ' ',
      DEVDEPENDENCY_COMMENT_TABLE_HEADER,
      COMMENT_TABLE_LINE,
      newDependencies.devDependencies.length && devDependenciesMessage,
      updatedDependencies.devDependencies.length &&
        updatedDevDependenciesMessage,
      removedDependencies.devDependencies.length &&
        removedDevDependenciesMessage
    ]).join(`\n`)
    core.debug(
      JSON.stringify(
        {
          hasUpdatedDevDependencies,
          devDependenciesMessage,
          updatedDevDependenciesMessage,
          removedDevDependenciesMessage
        },
        null,
        2
      )
    )
  }

  let checklistSection: string
  if (showChecklist === 'true') {
    checklistSection = compact([
      '- [ ] Did you check the impact on the platform?',
      '- [ ] Did you check if these libraries are still supported?',
      '- [ ] Did you check if there are security vulnerabilities?',
      '- [ ] Did you check if the licenses are compatible with our products?',
      ' '
    ]).join(`\n`)
  } else {
    checklistSection = '\n'
  }

  return compact([
    COMMENT_IDENTIFIER,
    checklistSection,
    DEPENDENCY_COMMENT_TABLE_HEADER,
    COMMENT_TABLE_LINE,
    newDependencies.dependencies.length && dependenciesMessage,
    updatedDependencies.dependencies.length && updatedDependenciesMessage,
    removedDependencies.dependencies.length && removedDependenciesMessage,
    devMessage
  ]).join(`\n`)
}

export default draftMessage
