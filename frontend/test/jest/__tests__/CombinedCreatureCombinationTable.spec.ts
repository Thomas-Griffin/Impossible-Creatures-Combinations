import {describe, expect, it} from '@jest/globals';
import {installQuasarPlugin} from '@quasar/quasar-app-extension-testing-unit-jest';
import {mount} from '@vue/test-utils';
import CombinedCreatureCombinationTable from '@/components/CombinedCreatureCombinationTable.vue';

// Specify here Quasar config you'll need to test your component
installQuasarPlugin();

describe('CombinedCreatureCombinationsTable', () => {
  it('renders correctly', () => {
    const wrapper = mount(CombinedCreatureCombinationTable);
    expect(wrapper.exists()).toBeTruthy();
  });
});
