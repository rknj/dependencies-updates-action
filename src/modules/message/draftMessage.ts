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
  showDevDependencies: string,
  showChecklist: string
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

  const dependenciesMessage = `${newDependencies.dependencies
    .map(dep => messageInfo('Added', info[dep]))
    .join(`\n`)}`
  core.debug(JSON.stringify({dependenciesMessage}, null, 2))

  const updatedDependenciesMessage = `${updatedDependencies.dependencies
    .map(dep => messageInfo('Updated', info[dep]))
    .join(`\n`)}`
  core.debug(JSON.stringify({updatedDependenciesMessage}, null, 2))

  let devMessage = ''
  if (showDevDependencies === 'true') {
    const devDependenciesMessage = `${newDependencies.devDependencies
      .map(dep => messageInfo('Added', info[dep]))
      .join(`\n`)}`
    core.debug(JSON.stringify({devDependenciesMessage}, null, 2))

    const updatedDevDependenciesMessage = `${updatedDependencies.devDependencies
      .map(dep => messageInfo('Updated', info[dep]))
      .join(`\n`)}`
    core.debug(JSON.stringify({updatedDevDependenciesMessage}, null, 2))

    devMessage = compact([
      ' ',
      DEVDEPENDENCY_COMMENT_TABLE_HEADER,
      COMMENT_TABLE_LINE,
      newDependencies.devDependencies.length && devDependenciesMessage,
      updatedDependencies.devDependencies.length &&
        updatedDevDependenciesMessage
    ]).join(`\n`)
  }

  let checklistSection = ''
  if (showChecklist === 'true') {
    checklistSection = '\n'
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
    devMessage
  ]).join(`\n`)
}

export default draftMessage
