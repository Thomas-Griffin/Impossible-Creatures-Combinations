<template>
  <DataTable
    ref="table"
    v-model:filters="filters"
    v-model:selection="selectedCombinations"
    :loading="loading"
    :rows="pagination.perPage"
    :rowsPerPageOptions="pagination.rowsPerPageOptions"
    :scroll-height="'calc(100vh - 200px)'"
    :table-style="{ height: 'calc(100vh - 200px)' }"
    :total-records="pagination.totalRecords"
    :value="combinations"
    columnResizeMode="expand"
    current-page-report-template="Showing {first} to {last} of {totalRecords} combinations"
    dataKey="_id"
    filter-display="menu"
    lazy
    paginator
    removable-sort
    reorderable-columns
    resizable-columns
    row-hover
    scrollable
    show-gridlines
    sortMode="multiple"
    @page="(event: any) => (pagination.page = event.page + 1)"
    @sort="onSort"
    @update:rows="(value: number) => (pagination.perPage = value)"
  >
    <template #header>
      <MultiSelect
        id="columns-select"
        :modelValue="selectedColumns"
        :options="columns"
        :selected-items-label="'Columns'"
        filter
        filter-placeholder="Search Columns"
        optionLabel="label"
        placeholder="Select Columns"
        scroll-height="300px"
        @update:modelValue="onColumnToggle"
      >
        <template #closeicon></template>
        <template #value>
          <span>Columns</span>
        </template>
      </MultiSelect>

      <span v-if="selectedCombinations.length > 1" class="m-4">
        {{ selectedCombinations.length }} combinations selected
      </span>
      <span v-else-if="selectedCombinations.length === 1" class="m-4">
        {{ selectedCombinations.length }} combination selected
      </span>

      <Button
        v-if="selectedCombinations.length > 0"
        icon="pi pi-external-link"
        label="Export"
        @click="exportCSV"
      />

      <Button
        v-if="filtersAreActive"
        class="ml-4"
        icon="pi pi-filter-slash"
        label="Clear Filters"
        type="button"
        @click="clearFilters"
      ></Button>
    </template>

    <template #loading>
      <Card class="flex justify-content-center align-items-center">
        <template #header>
          <ProgressSpinner
            animationDuration=".5s"
            class="mt-4"
            fill="var(--surface-ground)"
            strokeWidth="8"
            style="width: 50px; height: 50px"
          />
        </template>
        <template #content> Loading combination data. Please wait.</template>
      </Card>
    </template>

    <Column headerStyle="width: 3rem" selectionMode="multiple" />

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.ANIMAL_1)"
      :sortable="true"
      body-style="text-align: center"
      field="Animal 1"
      header="Animal 1"
    >
      <template #header>
        <img
          :src="`/icons/creature.svg`"
          alt="Animal 1"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.ANIMAL_1] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.ANIMAL_1 }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.ANIMAL_2)"
      :sortable="true"
      body-style="text-align: center"
      field="Animal 2"
      header="Animal 2"
    >
      <template #header>
        <img
          :src="`/icons/creature.svg`"
          alt="Animal 2"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.ANIMAL_2] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.ANIMAL_2 }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.RESEARCH_LEVEL)"
      :showFilterMatchModes="false"
      :sortable="true"
      field="Research Level"
      header="Research Level"
    >
      <template #body="{ data }">
        <div class="flex align-items-center justify-content-center">
          <img
            :alt="`${CombinationAttributeNames.RESEARCH_LEVEL} ${data[CombinationAttributeNames.RESEARCH_LEVEL]}`"
            :src="`/icons/research-level-${data[CombinationAttributeNames.RESEARCH_LEVEL]}.svg`"
            style="height: 2.5rem"
          />
        </div>
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.RESEARCH_LEVEL }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="
            getColumnMinMax(CombinationAttributeNames.RESEARCH_LEVEL)[1] ?? 5
          "
          :min="
            getColumnMinMax(CombinationAttributeNames.RESEARCH_LEVEL)[0] ?? 1
          "
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value ? filterModel.value[1] : 5"
            :min="1"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="5"
            :min="filterModel.value ? filterModel.value[0] : 1"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = [1, 5]"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.COAL)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Coal"
      header="Coal"
    >
      <template #header>
        <img :src="`/icons/coal.svg`" alt="Coal" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.COAL] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.COAL }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.COAL)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.COAL)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.COAL)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.COAL)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(CombinationAttributeNames.COAL)
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.ELECTRICITY)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Electricity"
      header="Electricity"
    >
      <template #header>
        <img
          :src="`/icons/electricity.svg`"
          alt="Electricity"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.ELECTRICITY] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.ELECTRICITY }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.ELECTRICITY)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.ELECTRICITY)[0]"
          class="m-3"
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.ELECTRICITY)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.ELECTRICITY)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.ELECTRICITY,
            )
          "
        />
      </template>
    </Column>
    <Column
      v-if="columnIsSelected(CombinationAttributeNames.HEAD)"
      :sortable="true"
      body-style="text-align: center"
      field="Head"
      header="Head"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Head" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Head"] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.HEAD }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.FRONT_LEGS)"
      :sortable="true"
      body-style="text-align: center"
      field="Front Legs"
      header="Front Legs"
    >
      <template #header>
        <img
          :src="`/icons/creature.svg`"
          alt="Front Legs"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.FRONT_LEGS] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.FRONT_LEGS }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.REAR_LEGS)"
      :sortable="true"
      body-style="text-align: center"
      field="Rear Legs"
      header="Rear Legs"
    >
      <template #header>
        <img
          :src="`/icons/creature.svg`"
          alt="Rear Legs"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.REAR_LEGS] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.REAR_LEGS }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.TAIL)"
      :sortable="true"
      body-style="text-align: center"
      field="Tail"
      header="Tail"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Tail" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.TAIL] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.TAIL }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.WINGS)"
      :sortable="true"
      body-style="text-align: center"
      field="Wings"
      header="Wings"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Wings" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.WINGS] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.WINGS }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.PINCERS)"
      :sortable="true"
      body-style="text-align: center"
      field="Pincers"
      header="Pincers"
    >
      <template #header>
        <img
          :src="`/icons/creature.svg`"
          alt="Pincers"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.PINCERS] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.PINCERS }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search"
          type="text"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.DEFENCE)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Defence"
      header="Defence"
    >
      <template #header>
        <img :src="`/icons/defence.svg`" alt="Defence" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.DEFENCE] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.DEFENCE }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.DEFENCE)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.DEFENCE)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.DEFENCE)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.DEFENCE)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.DEFENCE,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.HEALTH)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Health"
      header="Health"
    >
      <template #header>
        <img :src="`/icons/health.svg`" alt="Health" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Health"] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.HEALTH }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.HEALTH)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.HEALTH)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.HEALTH)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.HEALTH)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.HEALTH,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.EHP)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="EHP"
      header="EHP"
    >
      <template #header>
        <img :src="`/icons/ehp.svg`" alt="EHP" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.EHP] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.EHP }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.EHP)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.EHP)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.EHP)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.EHP)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(CombinationAttributeNames.EHP)
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.MELEE_DAMAGE)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Melee Damage"
      header="Melee Damage"
    >
      <template #header>
        <img
          :src="`/icons/melee-damage.svg`"
          alt="Melee Damage"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.MELEE_DAMAGE] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.MELEE_DAMAGE }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.MELEE_DAMAGE)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.MELEE_DAMAGE)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.MELEE_DAMAGE)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.MELEE_DAMAGE)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.MELEE_DAMAGE,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.POPULATION_SIZE)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Population Size"
      header="Population Size"
    >
      <template #header>
        <img
          :src="`/icons/population.svg`"
          alt="Population"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.POPULATION_SIZE] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.POPULATION_SIZE }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.POPULATION_SIZE)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.POPULATION_SIZE)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.POPULATION_SIZE)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.POPULATION_SIZE)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.POPULATION_SIZE,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.POWER)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Power"
      header="Power"
    >
      <template #header>
        <img :src="`/icons/power.svg`" alt="Power" style="height: 2.5rem" />
      </template>

      <template #body="{ data }">
        {{ data[CombinationAttributeNames.POWER] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.POWER }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.POWER)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.POWER)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.POWER)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.POWER)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(CombinationAttributeNames.POWER)
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.SDT)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="SDT"
      header="SDT"
    >
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.SDT] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.SDT }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.SDT)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.SDT)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.SDT)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.SDT)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(CombinationAttributeNames.SDT)
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.SIGHT_RADIUS)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Sight Radius"
      header="Sight Radius"
    >
      <template #header>
        <img
          :src="`/icons/sight-radius.svg`"
          alt="Sight Radius"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.SIGHT_RADIUS] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.SIGHT_RADIUS }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.SIGHT_RADIUS)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.SIGHT_RADIUS)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.SIGHT_RADIUS)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.SIGHT_RADIUS)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.SIGHT_RADIUS,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.SIZE)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Size"
      header="Size"
    >
      <template #header>
        <img :src="`/icons/size.svg`" alt="Size" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.SIZE] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.SIZE }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.SIZE)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.SIZE)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.SIZE)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.SIZE)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(CombinationAttributeNames.SIZE)
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.LAND_SPEED)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Land Speed"
      header="Land Speed"
    >
      <template #header>
        <img
          :src="`/icons/land-speed.svg`"
          alt="Land Speed"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.LAND_SPEED] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.LAND_SPEED }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.LAND_SPEED)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.LAND_SPEED)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.LAND_SPEED)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.LAND_SPEED)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.LAND_SPEED,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.WATER_SPEED)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Water Speed"
      header="Water Speed"
    >
      <template #header>
        <img
          :src="`/icons/water-speed.svg`"
          alt="Water Speed"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.WATER_SPEED] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.WATER_SPEED }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.WATER_SPEED)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.WATER_SPEED)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.WATER_SPEED)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.WATER_SPEED)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.WATER_SPEED,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.AIR_SPEED)"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Air Speed"
      header="Air Speed"
    >
      <template #header>
        <img
          :src="`/icons/air-speed.svg`"
          alt="Air Speed"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data[CombinationAttributeNames.AIR_SPEED] }}
      </template>
      <template #filterheader>
        <p class="text-center">
          {{ CombinationAttributeNames.AIR_SPEED }}
        </p>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax(CombinationAttributeNames.AIR_SPEED)[1]"
          :min="getColumnMinMax(CombinationAttributeNames.AIR_SPEED)[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :max="filterModel.value[1]"
            :min="getColumnMinMax(CombinationAttributeNames.AIR_SPEED)[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :max="getColumnMinMax(CombinationAttributeNames.AIR_SPEED)[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="
            filterModel.value = getColumnMinMax(
              CombinationAttributeNames.AIR_SPEED,
            )
          "
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.ABILITIES)"
      :showFilterMatchModes="false"
      body-style="text-align: center"
      filterField="Abilities.ability"
      header="Abilities"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{
            formatAbilities(data[CombinationAttributeNames.ABILITIES])
          }}</span>
        </div>
      </template>
      <template #filterheader>
        <p class="text-center">Ability</p>
      </template>
      <template #filter="{ filterModel }">
        <MultiSelect
          v-model="filterModel.value"
          :options="abilities"
          class="p-column-filter"
          placeholder="Any Ability"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected(CombinationAttributeNames.ABILITIES)"
      :showFilterMatchModes="false"
      body-style="text-align: center"
      filterField="Abilities.source"
      header="Ability Source"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{
            formatAbilitySources(data[CombinationAttributeNames.ABILITIES])
          }}</span>
        </div>
      </template>
      <template #filterheader>
        <p class="text-center">Ability Source</p>
      </template>
      <template #filter="{ filterModel }">
        <MultiSelect
          v-model="filterModel.value"
          :options="abilitySources"
          class="p-column-filter"
          placeholder="Any Source"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts" setup>
import lodash from "lodash";
import { useModStore } from "~/store/modStore";
import type { ModColumn } from "~/types/ModColumn";
import type Combination from "~/types/Combination";
import type GetCombinationsRequestBody from "~/types/getCombinationsRequestBody";
import type { CombinationAttributeName } from "~/types/CombinationAttributeName";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import type {
  DataTableExportCSVOptions,
  DataTableFilterMeta,
  DataTableSortEvent,
} from "primevue/datatable";
import type CombinationTableColumn from "~/types/CombinationTableColumn";
import { useCombinations } from "~/composables/useCombinations";
import type Ability from "~/types/Ability";
import { Abilities } from "~/types/enums/Abilities";
import SortingType from "~/types/SortingType";
import { CombinationAttributeNames } from "~/types/CombinationAttributeNames";
import { AbilitySources } from "~/types/enums/AbilitySources";

const abilities = ref(Object.values(Abilities));
const abilitySources = ref(Object.values(AbilitySources));

const { getCombinations, getTotalCombinations } = useCombinations();
const modStore = useModStore();

const loading = ref<boolean>(false);
const columns = ref<CombinationTableColumn[]>([]);
const table = ref();

const initialiseColumns = () => {
  columns.value =
    modStore.getMod.columns.map((column: ModColumn) => ({
      name: column.label,
      label: column.label,
      type: column.type,
      isSorted: {
        ascending: false,
        descending: false,
      },
      shown: true,
      min: column.min,
      max: column.max,
      filter: undefined,
    })) || [];
  selectedColumns.value = columns.value;
};

const getColumnMinMax = (columnName: CombinationAttributeNames) => {
  const column = modStore.getMod.columns.find(
    (column: ModColumn) => column.label === columnName,
  ) as ModColumn;
  return [column?.min || 0, column?.max || Number.MAX_SAFE_INTEGER];
};
const getInitialisedFilters = (): DataTableFilterMeta => {
  return {
    [CombinationAttributeNames.ANIMAL_1]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.ANIMAL_2]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.AIR_SPEED]: {
      value: getColumnMinMax(CombinationAttributeNames.AIR_SPEED),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.COAL]: {
      value: getColumnMinMax(CombinationAttributeNames.COAL),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.DEFENCE]: {
      value: getColumnMinMax(CombinationAttributeNames.DEFENCE),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.EHP]: {
      value: getColumnMinMax(CombinationAttributeNames.EHP),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.ELECTRICITY]: {
      value: getColumnMinMax(CombinationAttributeNames.ELECTRICITY),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.FRONT_LEGS]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.HEAD]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.HEALTH]: {
      value: getColumnMinMax(CombinationAttributeNames.HEALTH),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.LAND_SPEED]: {
      value: getColumnMinMax(CombinationAttributeNames.LAND_SPEED),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.MELEE_DAMAGE]: {
      value: getColumnMinMax(CombinationAttributeNames.MELEE_DAMAGE),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.PINCERS]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.POPULATION_SIZE]: {
      value: getColumnMinMax(CombinationAttributeNames.POPULATION_SIZE),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.POWER]: {
      value: getColumnMinMax(CombinationAttributeNames.POWER),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.REAR_LEGS]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.SDT]: {
      value: getColumnMinMax(CombinationAttributeNames.SDT),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.SIGHT_RADIUS]: {
      value: getColumnMinMax(CombinationAttributeNames.SIGHT_RADIUS),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.SIZE]: {
      value: getColumnMinMax(CombinationAttributeNames.SIZE),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.TAIL]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.TORSO]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    [CombinationAttributeNames.WATER_SPEED]: {
      value: getColumnMinMax(CombinationAttributeNames.WATER_SPEED),
      matchMode: FilterMatchMode.BETWEEN,
    },
    [CombinationAttributeNames.WINGS]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "Abilities.ability": {
      value: null,
      matchMode: FilterMatchMode.IN,
    },
    "Abilities.source": {
      value: null,
      matchMode: FilterMatchMode.IN,
    },
    [CombinationAttributeNames.RESEARCH_LEVEL]: {
      value: [1, 5],
      matchMode: FilterMatchMode.BETWEEN,
    },
  };
};

let defaultFilters: DataTableFilterMeta = getInitialisedFilters();

const filters = ref(defaultFilters);

const clearFilters = () => {
  filters.value = defaultFilters;
};

const filtersAreActive = computed(() => {
  return !lodash.isEqual(filters.value, defaultFilters);
});

const selectedColumns = ref<CombinationTableColumn[]>(columns.value);

const combinations = ref<Combination[]>([]);
const selectedCombinations = ref<Combination[]>([]);

const pagination = ref({
  page: 1,
  perPage: 50,
  rowsPerPageOptions: [1, 10, 50, 100],
  totalRecords: 0,
});

const sorting = ref<{
  column: CombinationAttributeName;
  order: SortingType;
}>({
  column: CombinationAttributeNames.ANIMAL_1,
  order: SortingType.ASCENDING,
});

onMounted(async () => {
  initialiseColumns();
  await tableRequest();
});

const tableRequest = async () => {
  if (loading.value) return;
  loading.value = true;
  let combinationsRequestBody: GetCombinationsRequestBody = {
    mod: { name: modStore.getMod.name, version: modStore.getMod.version },
    sorting: sorting.value,
    filters: filters.value,
    perPage: pagination.value.perPage,
    page: pagination.value.page,
  };
  pagination.value.totalRecords = await getTotalCombinations(
    combinationsRequestBody,
  );
  combinations.value = await getCombinations(combinationsRequestBody);
  loading.value = false;
};

const onColumnToggle = (modColumns: CombinationTableColumn[]) => {
  selectedColumns.value = modColumns;
};

const onSort = (event: DataTableSortEvent) => {
  if (!event.multiSortMeta || event.multiSortMeta.length === 0) return;
  sorting.value = {
    column: event.multiSortMeta[0].field as CombinationAttributeName,
    order:
      event.multiSortMeta[0].order === 1
        ? SortingType.ASCENDING
        : SortingType.DESCENDING,
  };
};

const columnIsSelected = (columnName: CombinationAttributeName) => {
  return selectedColumns.value.some((column) => column.name === columnName);
};

const formatAbilities = (abilities: Ability[]) => {
  return abilities
    .map(
      (ability: Ability, index: number) => `${index + 1}. ${ability.ability}`,
    )
    .join(", ");
};

const formatAbilitySources = (abilities: Ability[]) => {
  return abilities
    .map((ability: Ability, index: number) => `${index + 1}. ${ability.source}`)
    .join(", ");
};

const transformDataForExport = (combinations: Combination[]) => {
  return combinations.map((combination) => {
    let newCombination = { ...combination } as any;
    if (Array.isArray(newCombination.Abilities)) {
      newCombination.Abilities = formatAbilities(newCombination.Abilities);
    }
    return newCombination;
  });
};

const exportCSV = () => {
  table.value.exportCSV(
    { selectionOnly: true } as DataTableExportCSVOptions,
    transformDataForExport(selectedCombinations.value),
  );
};

watch(
  () => modStore.getMod,
  async () => {
    initialiseColumns();
    defaultFilters = getInitialisedFilters();
    filters.value = defaultFilters;
    await tableRequest();
  },
);

watch(
  [
    () => pagination.value.perPage,
    () => pagination.value.page,
    () => sorting.value,
    () => filters.value,
  ],
  async () => {
    await tableRequest();
  },
);
</script>

<style scoped>
img {
  display: block;
  margin-right: 0.5rem;
}
</style>
