import {DependenciesList} from '../../types/package'
import analysePackage from './analysePackage'
import * as core from '@actions/core'

/**
 * Returns the list of all new dependencies not existing in the base branch
 * for all the packages provided as a parameter
 *
 * @param files List of packages to analyse with the base branch
 */
async function analyseAllPackages(
  files: string[]
): Promise<{
  newDependencies: DependenciesList
  updatedDependencies: DependenciesList
}> {
  const newDependencies: DependenciesList = {
    dependencies: [],
    devDependencies: []
  }
  const updatedDependencies: DependenciesList = {
    dependencies: [],
    devDependencies: []
  }

  for (const file of files) {
    const result = await analysePackage(file)

    newDependencies.dependencies = [
      ...newDependencies.dependencies,
      ...result.newDependencies.dependencies
    ]

    newDependencies.devDependencies = [
      ...newDependencies.devDependencies,
      ...result.newDependencies.devDependencies
    ]

    updatedDependencies.dependencies = [
      ...updatedDependencies.dependencies,
      ...result.updatedDependencies.dependencies
    ]

    updatedDependencies.devDependencies = [
      ...updatedDependencies.devDependencies,
      ...result.updatedDependencies.devDependencies
    ]
  }

  core.debug(JSON.stringify({newDependencies, updatedDependencies}, null, 2))
  return {
    newDependencies,
    updatedDependencies
  }
}

export default analyseAllPackages
