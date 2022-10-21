import GitHubClient from '../../services/github-sdk'
import getLocalPackageInfo from './getLocalPackageInfo'
import {DependenciesList} from '../../types/package'
import * as core from '@actions/core'

async function analysePackage(
  file: string,
  showDevDependencies: string
): Promise<{
  newDependencies: DependenciesList
  updatedDependencies: DependenciesList
}> {
  const ghClient = GitHubClient.getClient()

  // fetches information about the package in the base branch
  const baseBranch = await ghClient.getBaseBranch()
  const basePackage = await ghClient.getPackage(file, baseBranch)
  const baseDeps = basePackage ? Object.keys(basePackage.dependencies) : []
  core.debug(JSON.stringify({baseDeps}, null, 2))

  // fetches information about the updated package file
  const updatedPackage = await getLocalPackageInfo(file)
  const updatedDeps = Object.keys(updatedPackage.dependencies)
  core.debug(JSON.stringify({updatedDeps}, null, 2))

  // filters new dependencies not existing in the base branch
  const newDeps = updatedDeps.filter(dep => !baseDeps.includes(dep))
  core.debug(JSON.stringify({newDeps}, null, 2))

  // filters upgraded dependencies
  const upgradedDeps = updatedDeps.filter(
    dep =>
      basePackage.dependencies[dep] &&
      basePackage.dependencies[dep] !== updatedPackage.dependencies[dep]
  )
  core.debug(JSON.stringify({upgradedDeps}, null, 2))

  let newDevDeps: string[] = []
  let upgradedDevDeps: string[] = []

  if (showDevDependencies === 'true') {
    const baseDevDeps = basePackage
      ? Object.keys(basePackage.devDependencies)
      : []
    core.debug(JSON.stringify({baseDevDeps}, null, 2))

    const updatedDevDeps = Object.keys(updatedPackage.devDependencies)
    core.debug(JSON.stringify({updatedDevDeps}, null, 2))

    newDevDeps = updatedDevDeps.filter(dep => !baseDevDeps.includes(dep))
    core.debug(JSON.stringify({newDevDeps}, null, 2))

    upgradedDevDeps = updatedDevDeps.filter(
      dep =>
        basePackage.devDependencies[dep] &&
        basePackage.devDependencies[dep] !== updatedPackage.devDependencies[dep]
    )
    core.debug(JSON.stringify({upgradedDevDeps}, null, 2))
  }

  const newDependencies: DependenciesList = {
    dependencies: newDeps,
    devDependencies: newDevDeps
  }
  const updatedDependencies: DependenciesList = {
    dependencies: upgradedDeps,
    devDependencies: upgradedDevDeps
  }

  return {
    newDependencies,
    updatedDependencies
  }
}

export default analysePackage
