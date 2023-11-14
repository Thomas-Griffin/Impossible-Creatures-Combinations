<template>
  <ResearchLevelsPerStockGraph />
  <CoalDistributionHistogram />
  <CoalDistributionPerResearchLevelHistogram />
  <ElectricityDistributionHistogram />
  <ElectricityDistributionPerResearchLevelHistogram />
</template>

<script setup>
import ResearchLevelsPerStockGraph from 'components/visualisations/ResearchLevelsPerStockGraph.vue'
import CoalDistributionHistogram from 'components/visualisations/CoalDistributionHistogram.vue'
import CoalDistributionPerResearchLevelHistogram from 'components/visualisations/CoalDistributionPerResearchLevelHistogram.vue'
import ElectricityDistributionHistogram from 'components/visualisations/ElectricityDistributionHistogram.vue'
import ElectricityDistributionPerResearchLevelHistogram from 'components/visualisations/ElectricityDistributionPerResearchLevelHistogram.vue'
</script>
