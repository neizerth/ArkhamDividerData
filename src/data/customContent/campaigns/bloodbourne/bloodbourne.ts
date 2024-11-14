import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'bloodbourne',
    type: 'side_campaign',
    name: 'Bloodborne: The City of the Unseen',
    custom_content: {
      creator: 'exhaled innards',
      download_link: {
        en: 'https://mysteriouschanting.wordpress.com/2024/02/18/bloodborne-the-city-of-the-unseen/'
      }
    }
  },
  scenarios: [
    {
      id: 'the_hunt_begins',
      scenario_name: 'The Hunt Begins',
      number_text: 'I',
      number: 1,
    },
    {
      id: 'fear_the_old_blood',
      scenario_name: 'Fear the Old Blood',
      number_text: 'II',
      number: 2,
    },
    {
      id: 'night_unending',
      scenario_name: 'Night Unending',
      number_text: 'III',
      number: 3,
    },
    {
      id: 'the_frailty_of_men',
      scenario_name: 'The Frailty of Men',
      number_text: 'IV',
      number: 4,
    },
    {
      id: 'the_altar_of_despair',
      scenario_name: 'The Altar of Despair',
      number_text: 'V',
      number: 5,
    },
    {
      id: 'a_call_beyond',
      scenario_name: 'A Call Beyond',
      number_text: 'VI',
      number: 6,
    },
    {
      id: 'communion',
      scenario_name: 'Communion',
      number_text: 'VII',
      number: 7,
    },
    {
      id: 'arkham_sunrise',
      scenario_name: 'Arkham Sunrise',
      number_text: 'VIII',
      number: 8,
    }
  ],
  encounterSets: [
    {
      name: 'Agents',
      code: 'agents'
    },
    {
      name: 'Beasts',
      code: 'beasts'
    },
    {
      name: 'Quite Thrilling!',
      code: 'quite_thrilling'
    },
    {
      name: 'Welcome to Yharnam',
      code: 'welcome_to_yharnam'
    },
    {
      name: 'Corruption',
      code: 'corruption'
    },
    {
      name: 'Radiance',
      code: 'radiance'
    },
    {
      name: 'Clawmark',
      code: 'clawmark'
    },
    {
      name: 'Arcane Lake',
      code: 'arcane_lake'
    },
    {
      name: 'Great Deep Sea',
      code: 'great_deep_sea'
    },
    {
      name: 'Hunters of Yharnam',
      code: 'hunters_of_yharnam'
    },
    {
      name: 'Lumenflower',
      code: 'lumenflower'
    },
    {
      name: 'Metamorphosis',
      code: 'metamorphosis'
    },
    {
      name: 'Milkweed',
      code: 'milkweed'
    },
    {
      name: 'Eldritch Eye',
      code: 'eldritch_eye'
    },
    {
      name: 'Moon',
      code: 'moon'
    },
    {
      name: 'Oedon Writhe',
      code: 'oedon_writhe'
    },
    {
      name: 'Silent Prayer',
      code: 'silent_prayer'
    },
    {
      name: 'Impurity',
      code: 'impurity'
    },
    {
      name: 'Celestial',
      code: 'celestial'
    },
    {
      name: 'Astral Clocktower',
      code: 'astral_clocktower'
    },
    {
      name: 'Living String',
      code: 'living_string'
    },
    {
      name: 'Pthemerian Heir',
      code: 'pthemerian_heir'
    },
    {
      name: 'Delicate Keepsake',
      code: 'delicate_keepsake'
    },
    {
      name: 'Blood Rapture',
      code: 'blood_rapture'
    },
    {
      name: 'Hanged Man',
      code: 'hanged_man'
    },
    {
      name: 'Guidance',
      code: 'guidance'
    }
  ]
});