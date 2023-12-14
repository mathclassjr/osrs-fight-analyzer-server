import client from './client.ts'

async function buildTables(): Promise<void> {
    try {
        await client.connect();

        await client.query(`
            DROP TABLE IF EXISTS fight_summaries;
            DROP TABLE IF EXISTS fight_timeline;
            DROP TABLE IF EXISTS fights;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS osrs_names;
        `)

        await client.query(`
            CREATE TABLE osrs_names(
                "nameId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) UNIQUE,
                "lowerName" VARCHAR(255) GENERATED ALWAYS AS (LOWER(name)) STORED,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE users(
                "userId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "osrsName" UUID REFERENCES osrs_names("nameId"),
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE fights(
                "fightId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "fightHash" VARCHAR(255) UNIQUE NOT NULL,
                "characterName" UUID REFERENCES osrs_names("nameId"),
                "opponentName" UUID REFERENCES osrs_names("nameId"),
                "fightType" VARCHAR(255),
                "fightTime" TIMESTAMP,
                "uploadBy" UUID REFERENCES users("userId"),
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE fight_summaries(
                "summaryId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "fightId" UUID REFERENCES fights("fightId"),
                "name" UUID REFERENCES osrs_names("nameId"),
                hits SMALLINT,
                "offPrayHits" SMALLINT,
                "deservedDamage" DECIMAL(8, 3),
                damage SMALLINT,
                "totalMagicHits" SMALLINT,
                "magicHits" SMALLINT,
                "deservedMagicHits" DECIMAL(8, 2),
                "offensivePrayers" SMALLINT,
                "ghostBarrages" SMALLINT,
                "ghostBarragesDeserved" DECIMAL(8, 3),
                "healthHealed" SMALLINT,
                loss BOOLEAN,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE fight_timeline(
                "timelineId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "fightId" UUID REFERENCES fights("fightId"),
                "name" UUID REFERENCES osrs_names("nameId"),
                time TIMESTAMP,
                tick INTEGER,
                "fullFightData" BOOLEAN,
                "attackerGear" INTEGER[12],
                "attackerOverhead" VARCHAR(255),
                attack VARCHAR(255),
                "deservedDamage" DECIMAL(8, 3),
                accuracy DECIMAL(8, 3),
                "maxHit" SMALLINT,
                "lowestHit" SMALLINT,
                splash BOOLEAN,
                "defenderGear" INTEGER[12],
                "defenderOverhead" VARCHAR(255),
                "attackerOffensivePray" INTEGER,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    } catch (err) {
        console.log("Error buliding tables", err);
    }
}

buildTables().then(function() {
    console.log("Build tables");
}).catch(console.error).finally(function () {
    client.end();
})