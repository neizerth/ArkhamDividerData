
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'celtic_rising',
    type: 'side_campaign',
    name: 'Celtic Rising',
    custom_content: {
      creator: 'QggOne',
      download_link: {
        en: 'https://mysteriouschanting.wordpress.com/2022/07/20/celtic-rising-campaign/'
      }
    }
  },
  scenarios: [
    {
      id: '',
      scenario_name: 'Caorthannach\'s Song',
      number_text: 'I',
      number: 1,
    },
    {
      id: '',
      scenario_name: 'Away With The Fairies',
      number_text: 'II',
      number: 2,
    },
    {
      id: '',
      scenario_name: 'The Stephens Manor',
      number_text: 'III',
      number: 3,
    },
    {
      id: '',
      scenario_name: 'Flight From the Dullahan',
      number_text: 'IV',
      number: 4,
    },
    {
      id: '',
      scenario_name: 'Balor Rising',
      number_text: 'V',
      number: 5,
    },
    {
      id: '',
      scenario_name: 'The Phantom Queen',
      number_text: 'VI',
      number: 6,
    }
  ],
  encounterSets: [
    {
      name: 'Frozen Winds',
      code: 'frozen_winds'
    },
    {
      name: 'Celtic Evils',
      code: 'celtic_evils'
    },
    {
      name: 'Pests',
      code: 'pests'
    },
    {
      name: 'Burnt Air',
      code: 'burnt_air'
    },
    {
      name: 'Angry Pixies',
      code: 'angry_pixies'
    },
    {
      name: 'Mischievous Fairies',
      code: 'mischievous_fairies'
    },
    {
      name: 'Roadside',
      code: 'roadside'
    },
    {
      name: 'Lock and Key',
      code: 'lock_and_key'
    },
    {
      name: 'Sealed Runes',
      code: 'sealed_runes'
    },
    {
      name: 'Beyond the Grave',
      code: 'beyond_the_grave'
    },
    {
      name: 'The Deep Woods',
      code: 'the_deep_woods'
    },
    {
      name: 'Waterside',
      code: 'waterside'
    },
    {
      name: 'Cave Path',
      code: 'cave_path'
    },
    {
      name: 'Balors Command',
      code: 'balors_command'
    },
    {
      name: 'Balors Might',
      code: 'balors_might'
    },
    {
      name: 'Berserker',
      code: 'berserker'
    },
    {
      name: 'Caorthannach',
      code: 'caorthannach'
    },
    {
      name: 'Abject Mania',
      code: 'abject_mania'
    },
    {
      name: 'Losing Hope',
      code: 'losing_hope'
    },
    {
      name: 'Morrigan\'s Will',
      code: 'morrigans_will'
    }
  ]
});