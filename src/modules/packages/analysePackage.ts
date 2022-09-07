import GitHubClient from '../../services/github-sdk'
import getLocalPackageInfo from './getLocalPackageInfo'
import {DependenciesList} from '../../types/package'
import * as core from '@actions/core'

async function analysePackage(
  file: string
): Promise<{
  newDependencies: DependenciesList
  updatedDependencies: DependenciesList
}> {
  const ghClient = GitHubClient.getClient()

  // fetches information about the package in the base branch
  const baseBranch = await ghClient.getBaseBranch()
  const basePackage = await ghClient.getPackage(file, baseBranch)
  const baseDeps = basePackage ? Object.keys(basePackage.dependencies) : []
  const baseDevDeps = basePackage
    ? Object.keys(basePackage.devDependencies)
    : []

  core.debug(JSON.stringify({baseDeps, baseDevDeps}, null, 2))

  // fetches information about the updated package file
  const updatedPackage = await getLocalPackageInfo(file)
  const updatedDeps = Object.keys(updatedPackage.dependencies)
  const updatedDevDeps = Object.keys(updatedPackage.devDependencies)

  core.debug(JSON.stringify({updatedDeps, updatedDevDeps}, null, 2))

  // filters new dependencies not existing in the base branch
  const newDeps = updatedDeps.filter(dep => !baseDeps.includes(dep))
  const newDevDeps = updatedDevDeps.filter(dep => !baseDevDeps.includes(dep))

  core.debug(JSON.stringify({newDeps, newDevDeps}, null, 2))

  core.debug(JSON.stringify({basePackage, updatedPackage}, null, 2))
  // const upgradedDeps = Object.keys(
  //   Object.entries(basePackage.dependencies).filter(
  //     ([key, value]) => value !== updatedPackage.dependencies[key]
  //   )
  // )
  const upgradedDeps = updatedDevDeps.filter(
    dep => basePackage.dependencies[dep] !== updatedPackage.dependencies[dep]
  )
  const upgradedDevDeps = updatedDevDeps.filter(
    dep =>
      basePackage.devDependencies[dep] !== updatedPackage.devDependencies[dep]
  )

  core.debug(JSON.stringify({upgradedDeps, upgradedDevDeps}, null, 2))

  const newDependencies: DependenciesList = {
    dependencies: newDeps,
    devDependencies: newDevDeps
  }
  const updatedDependencies: DependenciesList = {
    dependencies: upgradedDeps,
    devDependencies: upgradedDevDeps
  }

  core.debug(JSON.stringify({newDependencies, updatedDependencies}, null, 2))
  return {
    newDependencies,
    updatedDependencies
  }
}

export default analysePackage
