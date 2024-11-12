
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'ages_unwound',
    type: 'side_campaign',
    name: 'Ages Unwound',
    custom_content: {
      creator: 'Olivia Juliet',
      download_link: {
        en: 'https://mysteriouschanting.wordpress.com/2021/11/10/ages-unwound-campaign/'
      }
    }
  },
  scenarios: [
    {
      id: 'night_of_fire',
      scenario_name: 'Night of Fire',
      number_text: 'I',
      number: 1
    },
    {
      id: 'the_myriad_gentleman',
      scenario_name: 'The Myriad Gentleman',
      number_text: 'II',
      number: 2
    },
    {
      id: 'a_world_torn_down',
      scenario_name: 'A World Torn Down',
      number_text: 'III',
      number: 3
    },
    {
      id: 'unstuck',
      scenario_name: 'Unstuck',
      number_text: 'IV',
      number: 4
    },
    {
      id: 'a_year_to_plan',
      scenario_name: 'A Year to Plan',
      number_text: 'V',
      number: 5
    },
    {
      id: 'a_world_torn_down_again',
      scenario_name: 'A World Torn Down Again',
      number_text: 'VI',
      number: 6
    },
    {
      id: 'time_runs_out',
      scenario_name: 'Time Runs Out',
      number_text: 'VII',
      number: 7
    }
  ],
  encounterSets: [
    {
      code: 'agents_of_aforgomon',
      name: 'Agents of Aforgomon'
    },
    {
      code: 'nyctophobia',
      name: 'Nyctophobia'
    },
    {
      code: 'thugs',
      name: 'Thugs'
    },
    {
      code: 'unravelling_years',
      name: 'Unravelling Years'
    },
    {
      code: 'shifting_reality',
      name: 'Shifting Reality'
    },
    {
      code: 'night_of_the_ritual',
      name: 'Night of the Ritual'
    },
    {
      code: 'myriad',
      name: 'Myriad'
    },
    {
      code: 'unleashed_chaos',
      name: 'Unleashed Chaos'
    },
    {
      code: 'paradox',
      name: 'Paradox'
    },
    {
      code: 'missions',
      name: 'Missions'
    }
  ]
});