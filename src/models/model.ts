export interface APIResponse {
    success: boolean,
    message: string,
    error?: string,
    data?: any
}

export interface Fight {
    character: Character,
    opponent: Character,
    fightType: string,
    fightTime: number,
}

export interface Character {
    name: string,
    hits: number,
    offPrayHits: number,
    deservedDamage: number,
    damage: number,
    totalMagicHits: number,
    magicHits: number,
    deservedMagicHits: number,
    offensivePrayers: number,
    ghostBarrages: number,
    ghostBarragesDeserved: number,
    healthHealed: number,
    loss: boolean,
    fightTimeline: AttackData[]
}

export interface AttackData {
    time: number,
    tick: number,
    fullFightData: boolean,
    attackerGear: number[],
    attackerOverhead: string,
    attack: string,
    deservedDamage: number,
    accuracy: number,
    maxHit: number,
    lowestHit: number,
    splash: boolean,
    combatLevels?: CombatLevels,
    defenderGear: number[],
    defenderOverhead: string,
    attackerOffensivePray: number
}

export interface CombatLevels {
    attack: number,
    strength: number,
    defense: number,
    range: number,
    mage: number,
    health: number
}

export interface Name {
    
}