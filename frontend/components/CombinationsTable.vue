<template>
  <DataTable
    ref="table"
    v-model:filters="filters"
    v-model:selection="selectedCombinations"
    :loading="loading"
    :rows="pagination.perPage"
    :rowsPerPageOptions="pagination.rowsPerPageOptions"
    :scroll-height="'calc(100vh - 200px)'"
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
    table-style="height: calc(100vh - 200px)"
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
        style="max-width: 15%"
        @update:modelValue="onColumnToggle"
      >
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
      v-if="columnIsSelected('Animal 1')"
      :sortable="true"
      body-style="text-align: center"
      field="Animal 1"
      header="Animal 1"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Animal 1"] }}
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
      v-if="columnIsSelected('Animal 2')"
      :sortable="true"
      body-style="text-align: center"
      field="Animal 2"
      header="Animal 2"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Animal 2"] }}
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
      v-if="columnIsSelected('Research Level')"
      :showFilterMatchModes="false"
      :sortable="true"
      field="Research Level"
      header="Research Level"
    >
      <template #body="{ data }">
        <div class="flex align-items-center justify-content-center">
          <img
            :alt="`Research Level ${data['Research Level']}`"
            :src="`/icons/research-level-${data['Research Level']}.svg`"
            style="height: 2.5rem"
          />
        </div>
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="5"
          :min="1"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="1"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="5"
            :min="filterModel.value[0]"
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
      v-if="columnIsSelected('Coal')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Coal"
      header="Coal"
    >
      <template #header>
        <img :src="`/icons/coal.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Coal"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Coal')[1]"
          :min="getColumnMinMax('Coal')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Coal')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Coal')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Coal')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Electricity')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Electricity"
      header="Electricity"
    >
      <template #header>
        <img
          :src="`/icons/electricity.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Electricity"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Electricity')[1]"
          :min="getColumnMinMax('Electricity')[0]"
          class="m-3"
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Electricity')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Electricity')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Electricity')"
        />
      </template>
    </Column>
    <Column
      v-if="columnIsSelected('Head')"
      :sortable="true"
      body-style="text-align: center"
      field="Head"
      header="Head"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Head"] }}
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
      v-if="columnIsSelected('Front Legs')"
      :sortable="true"
      body-style="text-align: center"
      field="Front Legs"
      header="Front Legs"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Front Legs"] }}
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
      v-if="columnIsSelected('Rear Legs')"
      :sortable="true"
      body-style="text-align: center"
      field="Rear Legs"
      header="Rear Legs"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Rear Legs"] }}
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
      v-if="columnIsSelected('Tail')"
      :sortable="true"
      body-style="text-align: center"
      field="Tail"
      header="Tail"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Tail"] }}
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
      v-if="columnIsSelected('Wings')"
      :sortable="true"
      body-style="text-align: center"
      field="Wings"
      header="Wings"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Wings"] }}
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
      v-if="columnIsSelected('Pincers')"
      :sortable="true"
      body-style="text-align: center"
      field="Pincers"
      header="Pincers"
    >
      <template #header>
        <img :src="`/icons/creature.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Pincers"] }}
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
      v-if="columnIsSelected('Defence')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Defence"
      header="Defence"
    >
      <template #header>
        <img :src="`/icons/defence.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Defence"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Defence')[1]"
          :min="getColumnMinMax('Defence')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Defence')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Defence')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Defence')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Health')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Health"
      header="Health"
    >
      <template #header>
        <img :src="`/icons/health.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Health"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Health')[1]"
          :min="getColumnMinMax('Health')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Health')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Health')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Health')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('EHP')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="EHP"
      header="EHP"
    >
      <template #header>
        <img :src="`/icons/ehp.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["EHP"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('EHP')[1]"
          :min="getColumnMinMax('EHP')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('EHP')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('EHP')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('EHP')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Melee Damage')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Melee Damage"
      header="Melee Damage"
    >
      <template #header>
        <img
          :src="`/icons/melee-damage.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Melee Damage"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Melee Damage')[1]"
          :min="getColumnMinMax('Melee Damage')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Melee Damage')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Melee Damage')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Melee Damage')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Population Size')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Population Size"
      header="Population Size"
    >
      <template #header>
        <img
          :src="`/icons/population.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Population Size"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Population Size')[1]"
          :min="getColumnMinMax('Population Size')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Population Size')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Population Size')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Population Size')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Power')"
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
        {{ data["Power"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Power')[1]"
          :min="getColumnMinMax('Power')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Power')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Power')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Power')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('SDT')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="SDT"
      header="SDT"
    >
      <template #body="{ data }">
        {{ data["SDT"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('SDT')[1]"
          :min="getColumnMinMax('SDT')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('SDT')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('SDT')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('SDT')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Sight Radius')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Sight Radius"
      header="Sight Radius"
    >
      <template #header>
        <img
          :src="`/icons/sight-radius.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Sight Radius"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Sight Radius')[1]"
          :min="getColumnMinMax('Sight Radius')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Sight Radius')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Sight Radius')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Sight Radius')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Size')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Size"
      header="Size"
    >
      <template #header>
        <img :src="`/icons/size.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Size"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Size')[1]"
          :min="getColumnMinMax('Size')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Size')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Size')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Size')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Land Speed')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Land Speed"
      header="Land Speed"
    >
      <template #header>
        <img
          :src="`/icons/land-speed.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Land Speed"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Land Speed')[1]"
          :min="getColumnMinMax('Land Speed')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Land Speed')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Land Speed')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Land Speed')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Water Speed')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Water Speed"
      header="Water Speed"
    >
      <template #header>
        <img
          :src="`/icons/water-speed.svg`"
          alt="Power"
          style="height: 2.5rem"
        />
      </template>
      <template #body="{ data }">
        {{ data["Water Speed"] }}
      </template>

      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Water Speed')[1]"
          :min="getColumnMinMax('Water Speed')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Water Speed')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Water Speed')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Water Speed')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Air Speed')"
      :showFilterMatchModes="false"
      :sortable="true"
      body-style="text-align: center"
      field="Air Speed"
      header="Air Speed"
    >
      <template #header>
        <img :src="`/icons/air-speed.svg`" alt="Power" style="height: 2.5rem" />
      </template>
      <template #body="{ data }">
        {{ data["Air Speed"] }}
      </template>
      <template #filter="{ filterModel }">
        <Slider
          v-model="filterModel.value"
          :max="getColumnMinMax('Air Speed')[1]"
          :min="getColumnMinMax('Air Speed')[0]"
          class="m-3"
          range
        ></Slider>
        <div class="flex align-items-center justify-content-between px-2">
          <InputNumber
            v-model="filterModel.value[0]"
            :input-style="{ 'max-width': '3rem' }"
            :max="filterModel.value[1]"
            :min="getColumnMinMax('Air Speed')[0]"
          />
          <InputNumber
            v-model="filterModel.value[1]"
            :input-style="{ 'max-width': '3rem' }"
            :max="getColumnMinMax('Air Speed')[1]"
            :min="filterModel.value[0]"
            style="margin-left: 4rem"
          />
        </div>
      </template>
      <template #filterclear="{ filterModel }">
        <Button
          class="p-button-sm p-button-outlined"
          label="Clear"
          @click="filterModel.value = getColumnMinMax('Air Speed')"
        />
      </template>
    </Column>

    <Column
      v-if="columnIsSelected('Abilities')"
      :showFilterMatchModes="false"
      body-style="text-align: center"
      filterField="Abilities.ability"
      header="Abilities"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <span>{{ formatAbilities(data["Abilities"]) }}</span>
        </div>
      </template>
      <template #filter="{ filterModel }">
        <MultiSelect
          v-model="filterModel.value"
          :options="abilities"
          class="p-column-filter"
          placeholder="Any"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts" setup>
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

const abilities = ref(Object.values(Abilities));

const { getCombinations, getTotalCombinations } = useCombinations();
const modStore = useModStore();

const loading = ref<boolean>(false);
const columns = ref<CombinationTableColumn[]>([]);
const table = ref();

const initialiseColumns = () => {
  columns.value =
    modStore.getMod.columns?.map((column: ModColumn) => ({
      name: column.label,
      label: column.label,
      type: column.type,
      isSorted: {
        ascending: false,
        descending: false,
      },
      shown: true,
      min: column.min ?? 0,
      max: column.max ?? Number.MAX_SAFE_INTEGER,
      filter: undefined,
    })) || [];
  selectedColumns.value = columns.value;
};

const getColumnMinMax = (columnName: CombinationAttributeName) => {
  const column = columns.value.find((column) => column.name === columnName);
  return [column?.min ?? 0, column?.max ?? Number.MAX_SAFE_INTEGER];
};

const filters = ref<DataTableFilterMeta>({
  "Animal 1": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "Animal 2": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "Air Speed": {
    value: getColumnMinMax("Air Speed"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  Coal: { value: getColumnMinMax("Coal"), matchMode: FilterMatchMode.BETWEEN },
  Defence: {
    value: getColumnMinMax("Defence"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  EHP: { value: getColumnMinMax("EHP"), matchMode: FilterMatchMode.BETWEEN },
  Electricity: {
    value: getColumnMinMax("Electricity"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  "Front Legs": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  Head: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  Health: {
    value: getColumnMinMax("Health"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  "Land Speed": {
    value: getColumnMinMax("Land Speed"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  "Melee Damage": {
    value: getColumnMinMax("Melee Damage"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  Pincers: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "Population Size": {
    value: getColumnMinMax("Population Size"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  Power: {
    value: getColumnMinMax("Power"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  "Rear Legs": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  SDT: { value: getColumnMinMax("SDT"), matchMode: FilterMatchMode.BETWEEN },
  "Sight Radius": {
    value: getColumnMinMax("Sight Radius"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  Size: { value: getColumnMinMax("Size"), matchMode: FilterMatchMode.BETWEEN },
  Tail: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  Torso: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "Water Speed": {
    value: getColumnMinMax("Water Speed"),
    matchMode: FilterMatchMode.BETWEEN,
  },
  Wings: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "Abilities.ability": { value: null, matchMode: FilterMatchMode.IN },
  "Research Level": { value: [1, 5], matchMode: FilterMatchMode.BETWEEN },
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
  order: "ascending" | "descending";
}>({
  column: "Animal 1",
  order: "ascending",
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
    filters: [],
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
    order: event.multiSortMeta[0].order === 1 ? "ascending" : "descending",
  };
};

const columnIsSelected = (columnName: CombinationAttributeName) => {
  return selectedColumns.value.some((column) => column.name === columnName);
};

const formatAbilities = (abilities: Ability[]) => {
  return abilities
    .map((ability: Ability) => `${ability.ability}: ${ability.source}`)
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
