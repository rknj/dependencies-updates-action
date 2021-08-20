import GitHubClient from '../../services/github-sdk'
import getLocalPackageInfo from './getLocalPackageInfo'
import {DependenciesList} from '../../types/package'

async function analysePackage(file: string): Promise<DependenciesList> {
  const ghClient = GitHubClient.getClient()

  // fetches information about the package in the base branch
  const baseBranch = await ghClient.getBaseBranch()
  const basePackage = await ghClient.getPackage(file, baseBranch)
  const baseDeps = basePackage ? Object.keys(basePackage.dependencies) : []
  const baseDevDeps = basePackage
    ? Object.keys(basePackage.devDependencies)
    : []

  // fetches information about the updated package file
  const addedPackage = await getLocalPackageInfo(file)
  const addedDeps = Object.keys(addedPackage.dependencies)
  const addedDevDeps = Object.keys(addedPackage.devDependencies)

  // filters new dependencies not existing in the base branch
  const newDeps = addedDeps.filter(dep => !baseDeps.includes(dep))
  const newDevDeps = addedDevDeps.filter(dep => !baseDevDeps.includes(dep))

  return {
    dependencies: newDeps,
    devDependencies: newDevDeps
  }
}

export default analysePackage
