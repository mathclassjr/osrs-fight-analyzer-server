import { QueryResult } from 'pg';
import client from './client.ts';

import { AttackData } from 'models/model';

async function createAttackData(attackData: AttackData, fightId: string, nameUUID: string) {
    try {
        //Clone deep copy

        // console.log(attackData);
        const clone = JSON.parse(JSON.stringify(await attackData));
        //Format object
        clone.time = new Date(clone.time).toISOString();
        delete clone.CombatLevels;

        //values
        // console.log(clone);
        // console.log("fightId", fightId);
        // console.log("nameUUID", nameUUID);

        //initial string
        const characterKeys = Object.keys(clone);
        characterKeys.push("fightId");
        characterKeys.push("name");

        let characterInsert = characterKeys.map((key) => `"${key}"`).join(", ");
        // console.log(characterInsert);

        let characterValues = characterKeys.map((key, index) => `$${index + 1}`).join(", ");
        // console.log(characterValues);

        const {rows: [result]}: QueryResult = await client.query(`
            INSERT INTO fight_timeline(${characterInsert})
            VALUES(${characterValues})
            RETURNING *;
        `, [...Object.values(clone), fightId, nameUUID]);

        return result;

    } catch (err) {
        console.error("Error creating fight_timeline", err);
    }
    return false;
}

export default {
    createAttackData
}