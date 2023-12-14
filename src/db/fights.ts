import { QueryResult } from 'pg';
import client from './client.ts';

import { Fight } from 'models/model';

import namesDB from './osrsNames.ts'

async function createFight(fight: Fight, fightHash: string, playerNameUUID: string, opponentNameUUID: string ,userId: string) {
    try {
        // console.log(fight);
        const {fightTime, fightType} = fight;

        const {rows: [result]}: QueryResult = await client.query(`
            INSERT INTO fights("characterName", "opponentName", "fightType", "fightTime", "fightHash")
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [playerNameUUID, opponentNameUUID, fightType, (new Date(fightTime)).toISOString(), fightHash]);

        return result;

    } catch (err) {
        console.error("Error creating fight", err);
    }
    return false;
}

async function getFightsByPlayerName(playerName: string): Promise<any[]> {
    try {
        const nameData = await namesDB.getNameIdByLowerName(playerName.toLowerCase());
        if(!nameData) {
            return [];
        }

        const {nameId: playerUUID} = nameData;

        const {rows: results}: QueryResult = await client.query(`
            SELECT
                f."fightId",
                cn."nameId" as "characterUUID",
                op."nameId" as "opponentUUID",
                cn.name AS "characterName",
                op.name AS "opponentName",
                f."fightType",
                f."fightTime",
                f."uploadBy",
                f.created AS "fightCreated"                
            FROM
                fights f
            LEFT JOIN
                osrs_names cn ON f."characterName" = cn."nameId"
            LEFT JOIN
                osrs_names op ON f."opponentName" = op."nameId"
            WHERE
                f."characterName" = $1;
        `, [playerUUID]);

        return results;

    } catch (err) {
        console.error("Error fetching fight", err);
    }
    return [];
}

export default {
    createFight,
    getFightsByPlayerName
}