import { IDatabase } from '@/types/database'
import { ICache } from './cache';

export type CustomStory = Omit<IDatabase.Story, 'code'> & {
    code: `-ad-${string}`
}

export type CustomPackEncounterSet = Omit<
        ICache.PackEncounterSet, 
        'pack_code' | 'cycle_code'
    > & {
        cycle_code: 'zsid' | 'zcam'
        pack_code: `-ad-${string}`
    };