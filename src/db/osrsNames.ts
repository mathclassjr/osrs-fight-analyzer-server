import client from './client.ts';

import { QueryResult } from 'pg';

async function getOrCreateName(name: string) {
    try {        

        const nameData = await getNameIdByName(name);

        if (nameData) {
            return nameData;
        }

        const { rows: [createdData] }: QueryResult = await client.query(`
            INSERT INTO osrs_names(name)
            VALUES($1)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name]);

        if (createdData) {
            return createdData;
        }

        // If the name was not created, attempt to fetch it again
        const existingNameData = await getNameIdByName(name);
        return existingNameData || null; // Return existing data or null
    } catch (err) {
        console.log(err);
        return null; // Handle the error or return a default value
    }
}


async function getNameIdByName(name: string) {
    try {
        const {rows: [nameData]}: QueryResult = await client.query(`
            SELECT * FROM osrs_names
            WHERE name = $1;            
        `, [name]);

        if(!nameData) {
            return false;
        }

        return nameData;
    } catch (err) {
        console.log(err);
    }
}

async function getNameIdByLowerName(name: string) {
    try {

        const searchName: string = name.toLowerCase();

        const {rows: [nameData]}: QueryResult = await client.query(`
            SELECT * FROM osrs_names
            WHERE "lowerName" = $1;            
        `, [searchName]);

        if(!nameData) {
            return false;
        }

        return nameData;
    } catch (err) {
        console.log(err);
    }
}

export default {
    getOrCreateName,
    getNameIdByName,
    getNameIdByLowerName
}