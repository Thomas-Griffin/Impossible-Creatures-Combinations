export default interface CoalDistributionPerResearchLevelResponse {
  bounds: {
    lower: number
    upper: number
  }
  counts: {
    'Research Level 1': number
    'Research Level 2': number
    'Research Level 3': number
    'Research Level 4': number
    'Research Level 5': number
  }
}
