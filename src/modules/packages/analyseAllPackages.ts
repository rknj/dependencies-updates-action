import {DependenciesList} from '../../types/package'
import analysePackage from './analysePackage'

/**
 * Returns the list of all new dependencies not existing in the base branch
 * for all the packages provided as a parameter
 *
 * @param files List of packages to analyse with the base branch
 * @param showDevDependencies Flag to enable the analysis of the dev dependencies
 */
async function analyseAllPackages(
  files: string[],
  showDevDependencies: string
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
    const result = await analysePackage(file, showDevDependencies)

    newDependencies.dependencies = [
      ...newDependencies.dependencies,
      ...result.newDependencies.dependencies
    ]

    updatedDependencies.dependencies = [
      ...updatedDependencies.dependencies,
      ...result.updatedDependencies.dependencies
    ]

    if (showDevDependencies === 'true') {
      newDependencies.devDependencies = [
        ...newDependencies.devDependencies,
        ...result.newDependencies.devDependencies
      ]

      updatedDependencies.devDependencies = [
        ...updatedDependencies.devDependencies,
        ...result.updatedDependencies.devDependencies
      ]
    }
  }

  return {
    newDependencies,
    updatedDependencies
  }
}

export default analyseAllPackages
