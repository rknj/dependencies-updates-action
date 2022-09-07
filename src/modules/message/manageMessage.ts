import {DependenciesList} from '../../types/package'
import GitHubClient from '../../services/github-sdk'
import draftMessage from './draftMessage'
import * as core from '@actions/core'

async function manageMessage(
  newDependencies?: DependenciesList,
  updatedDependencies?: DependenciesList
): Promise<void> {
  const ghClient = GitHubClient.getClient()
  const actionMessageId = await ghClient.fetchMessage()
  const hasNewDependencies =
    newDependencies?.dependencies.length ||
    newDependencies?.devDependencies.length
  const hasUpdatedDependencies =
    updatedDependencies?.dependencies.length ||
    updatedDependencies?.devDependencies.length

  core.debug(
    JSON.stringify(
      {actionMessageId, hasNewDependencies, hasUpdatedDependencies},
      null,
      2
    )
  )

  // early-termination if there is no new dependencies and no existing message
  if (!actionMessageId && !hasNewDependencies && !hasUpdatedDependencies) return

  // termination with message deletion if existing message & no new dependencies
  if (actionMessageId && !hasNewDependencies && !hasUpdatedDependencies)
    return ghClient.deleteMessage()

  if (!newDependencies || !updatedDependencies) {
    throw new Error(
      'No new or updated dependencies should have been solved by the previous conditions'
    )
  }

  // generate the new content for the message
  const message = await draftMessage(newDependencies, updatedDependencies)

  core.debug(JSON.stringify({message}, null, 2))

  // publish the new content for the action
  await ghClient.setMessage(message)
}

export default manageMessage
