import { QueryResult } from 'pg';
import client from './client.ts';

import { Character } from 'models/model';

async function createFightSummary(summaryData: Character, fightId: string, nameUUID: string) {
    try {
        const clone = JSON.parse(JSON.stringify(summaryData));
        delete clone.fightTimeline;
        delete clone.name;        
        // console.log(clone);
        // console.log("fightId", fightId);
        // console.log("nameUUID", nameUUID);
        const characterKeys = Object.keys(clone);
        characterKeys.push("fightId");
        characterKeys.push("name");

        let characterInsert = characterKeys.map((key) => `"${key}"`).join(", ");
        // console.log(characterInsert);

        let characterValues = characterKeys.map((key, index) => `$${index + 1}`).join(", ");
        // console.log(characterValues);

        const {rows: [result]}: QueryResult = await client.query(`
            INSERT INTO fight_summaries(${characterInsert})
            VALUES(${characterValues})
            RETURNING *;
        `, [...Object.values(clone), fightId, nameUUID]);

        return result;

    } catch (err) {
        console.error("Error created fight summary", err);
    }
    return false;
}

export default {
    createFightSummary
}