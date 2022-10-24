import {DependenciesList} from '../../types/package'
import GitHubClient from '../../services/github-sdk'
import draftMessage from './draftMessage'
import * as core from '@actions/core'

async function manageMessage(
  showDevDependencies: string,
  showChecklist: string,
  newDependencies?: DependenciesList,
  updatedDependencies?: DependenciesList,
  removedDependencies?: DependenciesList
): Promise<void> {
  const ghClient = GitHubClient.getClient()
  const actionMessageId = await ghClient.fetchMessage()
  let hasNewDependencies = newDependencies?.dependencies.length
  if (showDevDependencies === 'true') {
    hasNewDependencies =
      hasNewDependencies || newDependencies?.devDependencies.length
  }
  let hasUpdatedDependencies = updatedDependencies?.dependencies.length
  if (showDevDependencies === 'true') {
    hasUpdatedDependencies =
      hasUpdatedDependencies || updatedDependencies?.devDependencies.length
  }
  let hasRemovedDependencies = removedDependencies?.dependencies.length
  if (showDevDependencies === 'true') {
    hasRemovedDependencies =
      hasRemovedDependencies || removedDependencies?.devDependencies.length
  }

  core.debug(
    JSON.stringify(
      {
        actionMessageId,
        hasNewDependencies,
        hasUpdatedDependencies,
        hasRemovedDependencies,
        showDevDependencies
      },
      null,
      2
    )
  )

  // early-termination if there is no new dependencies and no existing message
  if (
    !actionMessageId &&
    !hasNewDependencies &&
    !hasUpdatedDependencies &&
    !hasRemovedDependencies
  )
    return

  // termination with message deletion if existing message & no new dependencies
  if (
    actionMessageId &&
    !hasNewDependencies &&
    !hasUpdatedDependencies &&
    !hasRemovedDependencies
  )
    return ghClient.deleteMessage()

  if (!newDependencies || !updatedDependencies || !removedDependencies) {
    throw new Error(
      'No new or updated dependencies should have been solved by the previous conditions'
    )
  }

  // generate the new content for the message
  const message = await draftMessage(
    newDependencies,
    updatedDependencies,
    removedDependencies,
    showDevDependencies,
    showChecklist
  )

  core.debug(JSON.stringify({message}, null, 2))

  // publish the new content for the action
  await ghClient.setMessage(message)
}

export default manageMessage
