import {NextFunction, Request, Response} from 'express';
import md5 from 'md5';

import { APIResponse, Fight, Character, AttackData } from 'models/model';

import fightsDB from '../db/fights.ts';
import namesDB from '../db/osrsNames.ts';
import fightSummaryDB from '../db/fightSummaries.ts';
import fightTimelineDB from '../db/fightTimeline.ts';

// Function to map JSON data to Fight interface
function mapToFight(data: any[]): Fight[] {
    return data.map((fightData: any) => {
        return {
            character: mapToCharacter(fightData.c),
            opponent: mapToCharacter(fightData.o),
            fightType: fightData.l,
            fightTime: fightData.t,
        };
    })    
}


// https://github.com/Matsyir/pvp-performance-tracker/blob/b0b4d359ff17e819c3300e8840e8dbcc7dfe5b52/src/main/java/matsyir/pvpperformancetracker/controllers/Fighter.java
// Function to map JSON data to Character interface
function mapToCharacter(data: any): Character {    
    return {
        name: data.n,
        hits: data.a,
        offPrayHits: data.s,
        deservedDamage: data.d,
        damage: data.h,
        totalMagicHits: data.z,
        magicHits: data.m,
        deservedMagicHits: data.M,
        offensivePrayers: data.p,
        ghostBarrages: data.g,
        ghostBarragesDeserved: data.y,
        healthHealed: data.H,
        loss: data.x,
        fightTimeline: data.l.map((attack: any) => mapToAttackData(attack)),
    }
}

// https://github.com/Matsyir/pvp-performance-tracker/blob/b0b4d359ff17e819c3300e8840e8dbcc7dfe5b52/src/main/java/matsyir/pvpperformancetracker/models/FightLogEntry.java
// Function to map JSON data to AttackData interface
function mapToAttackData(data: any): AttackData {
    return {
        time: data.t,
        tick: data.T,
        fullFightData: data.f,
        attackerGear: data.G,
        attackerOverhead: data.O,
        attack: data.m, // Assuming this is the attack name
        deservedDamage: data.d,
        accuracy: data.a,
        maxHit: data.h,
        lowestHit: data.l,
        splash: data.s,
        // combatLevels: {
        //     attack: data?.C.a,
        //     strength: data?.C.s,
        //     defense: data?.C.d,
        //     range: data?.C.r,
        //     mage: data?.C.m,
        //     health: data?.C.h,
        // },
        defenderGear: data.g,
        defenderOverhead: data.o,
        attackerOffensivePray: data.p,
    }    
}

async function uploadFight(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { data } = req.body;
        const convertedFights = mapToFight(data);
        const answer: APIResponse = {
            success: true,
            message: `Received fights ${convertedFights.length}`,
        };
        console.log("Received", convertedFights.length);

        const localFightCache = new Map();

        res.status(200).json(answer);
                
        await Promise.all(convertedFights.map(async function (fight: Fight) {
            const { character: { name: playerName }, opponent: { name: opponentName }} = fight; 
            return [
                namesDB.getOrCreateName(playerName),
                namesDB.getOrCreateName(opponentName)
            ]      
        }));

        await Promise.all(convertedFights.map(async function (fight: Fight) {
            const { character: { name: playerName }, opponent: { name: opponentName }, fightTime } = fight;
            const key: string = playerName + "_" + opponentName + "_" + fightTime;
            const keyHash: string = md5(key);

            if (localFightCache.has(keyHash)) {
                // console.log("Duplicate fight", keyHash);
                // console.log(key);
                // console.log(localFightCache.get(keyHash));
                return;
            } else {
                localFightCache.set(keyHash, key);
            }

            try {
                const { nameId: playerNameUUID } = await namesDB.getOrCreateName(playerName);
                const { nameId: opponentNameUUID } = await namesDB.getOrCreateName(opponentName);

                const createdFight = await fightsDB.createFight(fight, keyHash, playerNameUUID, opponentNameUUID, "");

                if (createdFight) {                        
                    return ([
                        fightSummaryDB.createFightSummary(fight.character, createdFight.fightId, playerNameUUID),
                        fightSummaryDB.createFightSummary(fight.opponent, createdFight.fightId, opponentNameUUID),
                        ...fight.character.fightTimeline.map(async function (attackData: AttackData) {
                            return fightTimelineDB.createAttackData(attackData, createdFight.fightId, playerNameUUID);
                        }),
                        ...fight.opponent.fightTimeline.map(async function (attackData: AttackData) {
                            return fightTimelineDB.createAttackData(attackData, createdFight.fightId, opponentNameUUID);
                        })
                    ]);
                }
            } catch (error) {
                console.error("Error processing fight:", error);
                // Handle the error as needed for logging or further actions
            }
        }));        
    } catch (err) {
        next(err);
    }
}

async function getFights(req: Request, res: Response, next: NextFunction) {
    try {
        const {playerName} = req.params;
        const data: any[] = await fightsDB.getFightsByPlayerName(playerName);
        const answer: APIResponse = {
            success: true,
            message: `Returned ${data.length} fights`,
            data,
        }
        res.status(200).json(answer);
    } catch (error) {
        next(error);
    }
}


export default {
    uploadFight,
    getFights
}