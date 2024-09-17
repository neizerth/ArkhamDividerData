import * as API from '@/api/arkhamCards/api';

export const getStandaloneScenarios = async () => {
  return await API.loadJSONStandaloneScenarios();
}