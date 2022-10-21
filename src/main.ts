import * as core from '@actions/core'
import getPackageFiles from './modules/packages/getPackageFiles'
import analyseAllPackages from './modules/packages/analyseAllPackages'
import manageMessage from './modules/message/manageMessage'

async function run(): Promise<void> {
  try {
    // get updated files in this PR
    const packageFiles = await getPackageFiles()

    // early-termination if there is no file
    if (!packageFiles.length) return manageMessage('false', 'false')

    const showDevDependencies = core.getInput('show_dev_dependencies')
    const showChecklist = core.getInput('show_checklist')

    // fetch list of new dependencies for all detected packages
    const {newDependencies, updatedDependencies} = await analyseAllPackages(
      packageFiles,
      showDevDependencies
    )
    core.debug(JSON.stringify({newDependencies, updatedDependencies}, null, 2))

    // manage the publication of a message listing the new dependencies if needed
    await manageMessage(
      showDevDependencies,
      showChecklist,
      newDependencies,
      updatedDependencies
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
