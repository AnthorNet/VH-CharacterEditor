export default class SaveParser_Write
{
    constructor(options)
    {
        this.saveParser             = options.saveParser;
        this.callback               = options.callback;

        // Used for writing...
        this.currentBufferLength    = 0;
        this.currentEntityLength    = 0;
    }

    streamSave()
    {
        console.time('writeFileSaveAs');

        this.saveBlobArray  = [];
        this.saveBinary     = '';

        this.writeStats();
    }

    writeStats()
    {
        let stats   = '';
            stats  += this.writeInt(this.saveParser.stats.dataVersion);
            stats  += this.writeInt(this.saveParser.stats.kills);
            stats  += this.writeInt(this.saveParser.stats.deaths);
            stats  += this.writeInt(this.saveParser.stats.crafts);
            stats  += this.writeInt(this.saveParser.stats.builds);

        this.saveBinary += stats;

        this.writeData();
    }

    writeData()
    {
        let worldDataLength     = this.saveParser.worldData.length;
            this.saveBinary    += this.writeInt(worldDataLength);

            for(let i = 0; i < worldDataLength; i++)
            {
                this.saveBinary += this.writeWorldData(this.saveParser.worldData[i]);
            }

       this.saveBinary += this.writeString(this.saveParser.player.name);
       this.saveBinary += this.writeUInt64(this.saveParser.player.id);
       this.saveBinary += this.writeString(this.saveParser.player.seed);

       if(this.saveParser.player.data !== undefined)
       {
           this.saveBinary += this.writeByte(1);
           this.saveBinary += this.writePlayerData(this.saveParser.player.data);
           this.currentEntityLength    = 0;
       }
       else
       {
           this.saveBinary += this.writeByte(0);
       }

       this.saveFile();
    }

    saveFile()
    {
        // Prepend save length
        this.saveBinary     = this.writeInt(this.currentBufferLength) + this.saveBinary;

        // Append hash
        //TODO: Generate hash with SHA512 before the save length prepend
        this.saveBinary    += this.writeInt(this.saveParser.hash.length);
        this.saveBinary    += this.writeHex(this.saveParser.hash);

        // Convert to buffer
        let length          = this.saveBinary.length;
        let buffer          = new Uint8Array(length);
            for(let j = 0; j < length; j++)
            {
                buffer[j]   = this.saveBinary.charCodeAt(j) & 0xFF;
            }

        // Send file!
        saveAs(
            new Blob(
                [buffer],
                {type: "application/octet-stream; charset=utf-8"}
            ), this.saveParser.fileName.replace('.fch', '') + '_CALCULATOR.fch'
        );


        window.VHCE.hideLoader();
        console.timeEnd('writeFileSaveAs');

        this.saveBinary     = '';
        this.saveBlobArray  = [];
        return;
    }

    /**
     * SAVE PROPERTIES
     */
    writeWorldData(data)
    {
        let worldData   = '';
            worldData  += this.writeUInt64(data.id);

            worldData  += this.writeByte(data.haveCustomSpawnPoint);
            worldData  += this.writeVector3(data.spawnPoint);

            worldData  += this.writeByte(data.haveLogoutPoint);
            worldData  += this.writeVector3(data.logoutPoint);

            worldData  += this.writeByte(data.haveDeathPoint);
            worldData  += this.writeVector3(data.deathPoint);

            worldData  += this.writeVector3(data.homePoint);

            if(data.mapData !== undefined)
            {
                worldData  += this.writeByte(1);
                worldData  += this.writeMapData(data.mapData);
            }
            else
            {
                worldData  += this.writeByte(0);
            }

        return worldData;
    }

    writeMapData(data)
    {
            this.currentEntityLength    = 0;
        let mapData     = '';
            mapData    += this.writeInt(data.dataVersion);
            mapData    += this.writeInt(data.textureSize);

            for(let x = 0; x < data.textureSize; x++)
            {
                for(let y = 0; y < data.textureSize; y++)
                {
                    mapData += this.writeByte(data.exploredData[x][y]);
                }
            }

            let nbPins      = data.pins.length;
                mapData    += this.writeInt(nbPins);

                for(let i = 0; i < nbPins; i++)
                {
                    mapData    += this.writeString(data.pins[i].name);

                    mapData    += this.writeFloat(data.pins[i].x);
                    mapData    += this.writeFloat(data.pins[i].y);
                    mapData    += this.writeFloat(data.pins[i].z);

                    mapData    += this.writeInt(data.pins[i].type);
                    mapData    += this.writeByte(data.pins[i].checked);
                }

            mapData    += this.writeByte(data.showPlayerOnMap);

        return this.writeInt(this.currentEntityLength) + mapData;
    }

    writePlayerData(data)
    {
            this.currentEntityLength    = 0;
        let playerData  = '';
            playerData += this.writeInt(data.dataVersion);

            playerData += this.writeFloat(data.maxHealth);
            playerData += this.writeFloat(data.health);
            playerData += this.writeFloat(data.stamina);

            playerData += this.writeByte(data.firstSpawn);
            playerData += this.writeFloat(data.timeSinceDeath);

            playerData += this.writeString(data.guardianPower);
            playerData += this.writeFloat(data.guardianPowerCD);

            playerData += this.writeInventory(data.inventory);

            /* Known */
            playerData += this.writeArrayOfString(data.recipes);
            playerData += this.writeStations(data.stations);
            playerData += this.writeArrayOfString(data.materials);
            playerData += this.writeArrayOfString(data.tutorials);
            playerData += this.writeArrayOfString(data.uniques);
            playerData += this.writeArrayOfString(data.trophies);
            playerData += this.writeArrayOfInt(data.biomes);
            playerData += this.writeTexts(data.texts);

            /* Look */
            playerData += this.writeString(data.beard);
            playerData += this.writeString(data.hair);
            playerData += this.writeRGB(data.skinColor);
            playerData += this.writeRGB(data.hairColor);
            playerData += this.writeInt(data.model);

            playerData += this.writeFoods(data.foods);
            playerData += this.writeSkills(data.skills);

        return this.writeInt(this.currentEntityLength) + playerData;
    }

    writeInventory(data)
    {
        let inventory   = '';
            inventory  += this.writeInt(data.dataVersion);

        let nbItems     = data.data.length;
            inventory  += this.writeInt(nbItems);

            for(let i = 0; i < nbItems; i++)
            {
                inventory += this.writeString(data.data[i].name);
                inventory += this.writeInt(data.data[i].qty);
                inventory += this.writeFloat(data.data[i].durability);
                inventory += this.writeInt(data.data[i].position.col);
                inventory += this.writeInt(data.data[i].position.row);
                inventory += this.writeByte(data.data[i].isEquipped);
                inventory += this.writeInt(data.data[i].quality);
                inventory += this.writeInt(data.data[i].variant);
                inventory += this.writeUInt64(data.data[i].crafterId);
                inventory += this.writeString(data.data[i].crafterName);
            }

        return inventory;
    }

    writeArrayOfString(data)
    {
        let array       = '';
        let nbString    = data.length;
            array      += this.writeInt(nbString);

            for(let i = 0; i < nbString; i++)
            {
                array += this.writeString(data[i]);
            }

        return array;
    }

    writeArrayOfInt(data)
    {
        let array       = '';
        let nbInt       = data.length;
            array      += this.writeInt(nbInt);

            for(let i = 0; i < nbInt; i++)
            {
                array += this.writeInt(data[i]);
            }

        return array;
    }

    writeStations(data)
    {
        let stations    = '';
        let nbStations  = data.length;
            stations   += this.writeInt(nbStations);

            for(let i = 0; i < nbStations; i++)
            {
                stations   += this.writeString(data[i].name);
                stations   += this.writeInt(data[i].level);
            }

        return stations;
    }

    writeTexts(data)
    {
        let texts   = [];
        let nbTexts = data.length;
            texts  += this.writeInt(nbTexts);

            for(let i = 0; i < nbTexts; i++)
            {
                texts  += this.writeString(data[i].unk1);
                texts  += this.writeString(data[i].unk2);
            }

        return texts;
    }

    writeFoods(data)
    {
        let foods   = '';
        let nbFoods = data.length;
            foods  += this.writeInt(nbFoods);

            for(let i = 0; i < nbFoods; i++)
            {
                foods  += this.writeString(data[i].name);
                foods  += this.writeFloat(data[i].hp);
                foods  += this.writeFloat(data[i].stamina);
            }

        return foods;
    }

    writeSkills(data)
    {
        let skills      = '';
        let nbSkills    = data.data.length;
            skills     += this.writeInt(data.dataVersion);
            skills     += this.writeInt(nbSkills);

            for(let i = 0; i < nbSkills; i++)
            {
                skills += this.writeInt(data.data[i].id);
                skills += this.writeFloat(data.data[i].level);
                skills += this.writeFloat(data.data[i].accumulator);
            }

        return skills;
    }

    /*
     * BYTES MANIPULATIONS
     */
    writeByte(value)
    {
        if(this.precacheByte === undefined)
        {
            this.precacheByte = [];
        }
        if(this.precacheByte[value] === undefined)
        {
            this.precacheByte[value] = String.fromCharCode(value & 0xff);
        }

        this.currentBufferLength += 1;
        this.currentEntityLength += 1;

        return this.precacheByte[value];
    }

    writeHex(value)
    {
        this.currentBufferLength += value.length;
        this.currentEntityLength += value.length;

        return value;
    }

    // https://github.com/feross/buffer/blob/v6.0.3/index.js#L1440
    writeInt8(value)
    {
        let arrayBuffer     = new Uint8Array(1);
            arrayBuffer[0]  = (value & 0xff);

        this.currentBufferLength++;
        this.currentEntityLength++;

        return String.fromCharCode.apply(null, arrayBuffer);
    }

    // https://github.com/feross/buffer/blob/v6.0.3/index.js#L1469
    writeInt(value)
    {
        let arrayBuffer = new Uint8Array(4);
            arrayBuffer[3] = (value >>> 24);
            arrayBuffer[2] = (value >>> 16);
            arrayBuffer[1] = (value >>> 8);
            arrayBuffer[0] = (value & 0xff);

        this.currentBufferLength += 4;
        this.currentEntityLength += 4;

        return String.fromCharCode.apply(null, arrayBuffer);
    }

    // https://github.com/feross/buffer/blob/v6.0.3/index.js#L1492
    writeUInt64(value)
    {
        let arrayBuffer     = new Uint8Array(8);
        let lo              = Number(value & BigInt(0xffffffff));
        let hi              = Number(value >> BigInt(32) & BigInt(0xffffffff));

            arrayBuffer[0]  = lo;
            lo              = lo >> 8;
            arrayBuffer[1]  = lo;
            lo              = lo >> 8;
            arrayBuffer[2]  = lo;
            lo              = lo >> 8;
            arrayBuffer[3]  = lo;

            arrayBuffer[4]  = hi;
            hi              = hi >> 8;
            arrayBuffer[5]  = hi;
            hi              = hi >> 8;
            arrayBuffer[6]  = hi;
            hi              = hi >> 8;
            arrayBuffer[7]  = hi;

        this.currentBufferLength += 8;
        this.currentEntityLength += 8;

        return String.fromCharCode.apply(null, arrayBuffer);
    }

    writeFloat(value)
    {
        let arrayBuffer     = new ArrayBuffer(4);
        let dataView        = new DataView(arrayBuffer);
            dataView.setFloat32(0, value, true);

        this.currentBufferLength += 4;
        this.currentEntityLength += 4;

        return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
    }

    writeVector3(value)
    {
        let vector3     = '';
            vector3    += this.writeFloat(value.x);
            vector3    += this.writeFloat(value.y);
            vector3    += this.writeFloat(value.z);

        return vector3;
    }

    writeRGB(value)
    {
        let rgb     = '';
            rgb    += this.writeFloat(value.r);
            rgb    += this.writeFloat(value.g);
            rgb    += this.writeFloat(value.b);

        return rgb;
    }

    writeString(value)
    {
        let stringLength    = value.length;

            if(stringLength === 0)
            {
                return this.writeInt8(0);
            }

        let saveBinary  = this.writeInt8(stringLength);
            saveBinary += value;

        this.currentBufferLength += stringLength;
        this.currentEntityLength += stringLength;

        return saveBinary;
    }
}