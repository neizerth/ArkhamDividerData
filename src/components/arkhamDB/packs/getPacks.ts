import * as API from '@/api/arkhamDB/api';

export const getPacks = async () => {
  const packs = await API.loadJSONPacks();

  return packs.map(({ 
    code,
    name,
    cycle_code,
    date_release,
    cgdb_id,
    position
  }) => {
    return {
      code,
      name,
      cycle_code,
      date_release,
      cgdb_id,
      is_official: true,
      position
    }
  });
}