/* global Sentry */
import Modal                                    from '../Modal.js';

export default class SaveParser_Read
{
    constructor(options)
    {
        console.time('loadSave');

        this.saveParser         = options.saveParser;
        this.callback           = options.callback;

        this.arrayBuffer        = this.saveParser.arrayBuffer;
        this.bufferView         = new DataView(this.arrayBuffer); // Still used for header...
        this.currentByte        = 0;

        this.readInt(); // Skip save length

        this.parseStats();
    }

    parseStats()
    {
        this.saveParser.stats               = {};
        this.saveParser.stats.dataVersion   = this.readInt();
        this.saveParser.stats.kills         = this.readInt();
        this.saveParser.stats.deaths        = this.readInt();
        this.saveParser.stats.crafts        = this.readInt();
        this.saveParser.stats.builds        = this.readInt();

        this.parseData();
    }

    parseData()
    {
        let nbWorldData                 = this.readInt();
            this.saveParser.worldData   = [];

            for(let i = 0; i < nbWorldData; i++)
            {
                this.saveParser.worldData.push(this.readWorldData());
            }

        this.saveParser.player = {
            name    : this.readString(),
            id      : this.readUInt64(),
            seed    : this.readString()
        };

        let havePlayerData = this.readByte();
            if(havePlayerData === 1)
            {
                this.saveParser.player.data = this.readPlayerData();
            }

        this.parseHash();
    }

    parseHash()
    {
        let hashLength              = this.readInt();
            this.saveParser.hash    = this.readHex(hashLength);

        console.timeEnd('loadSave');

        if(this.callback !== null)
        {
            $('#loaderProgressBar .progress-bar').css('width', '45%');



            console.log(this.saveParser);

            setTimeout(() => {
                return this.callback();
            }, 50);
        }
    }

    /**
     * SAVE PROPERTIES
     */
    readWorldData()
    {
        let worldData                           = {};
            worldData.id                        = this.readUInt64();

            worldData.haveCustomSpawnPoint      = this.readByte();
            worldData.spawnPoint                = this.readVector3();

            worldData.haveLogoutPoint           = this.readByte();
            worldData.logoutPoint               = this.readVector3();

            worldData.haveDeathPoint            = this.readByte();
            worldData.deathPoint                = this.readVector3();

            worldData.homePoint                 = this.readVector3();

            let hasMapData = this.readByte();
                if(hasMapData === 1)
                {
                    worldData.mapData = this.readMapData();
                }

        return worldData;
    }

    readMapData()
    {
        this.readInt(); // Skip map length

        let mapData                 = {};
            mapData.dataVersion     = this.readInt();
            mapData.textureSize     = this.readInt();
            mapData.explored        = 0;
            mapData.exploredData    = [];
            mapData.pins            = [];
            // float exp = explored /((float)textureSize * textureSize);

            for(let x = 0; x < mapData.textureSize; x++)
            {
                mapData.exploredData[x] = [];

                for(let y = 0; y < mapData.textureSize; y++)
                {
                    mapData.exploredData[x][y] = this.readByte()

                    if(mapData.exploredData[x][y] === 1)
                    {
                        mapData.explored++;
                    }
                }
            }

            let nbPins = this.readInt();
                for(let i = 0; i < nbPins; i++)
                {
                    let pin = {
                        name    : this.readString(),

                        x       : this.readFloat(),
                        y       : this.readFloat(),
                        z       : this.readFloat(),

                        type    : this.readInt(),
                        checked : this.readByte()
                    };

                    mapData.pins.push(pin);
                }

            mapData.showPlayerOnMap = this.readByte();

        return mapData;
    }

    readPlayerData()
    {
        this.readInt(); // Skip player length

        let playerData                  = {};
            playerData.dataVersion      = this.readInt();
            playerData.maxHealth        = this.readFloat();
            playerData.health           = this.readFloat();
            playerData.stamina          = this.readFloat();

            playerData.firstSpawn       = this.readByte();
            playerData.timeSinceDeath   = this.readFloat();

            playerData.guardianPower    = this.readString();
            playerData.guardianPowerCD  = this.readFloat();

            playerData.inventory        = this.readInventory();

            /* Known */
            playerData.recipes          = this.readArrayOfString();
            playerData.stations         = this.readStations();
            playerData.materials        = this.readArrayOfString();
            playerData.tutorials        = this.readArrayOfString();
            playerData.uniques          = this.readArrayOfString();
            playerData.trophies         = this.readArrayOfString();
            playerData.biomes           = this.readArrayOfInt();
            playerData.texts            = this.readTexts();

            /* Look */
            playerData.beard            = this.readString();
            playerData.hair             = this.readString();
            playerData.skinColor        = this.readRGB();
            playerData.hairColor        = this.readRGB();
            playerData.model            = this.readInt();

            playerData.foods            = this.readFoods();
            playerData.skills           = this.readSkills();

        return playerData;
    }

    readInventory()
    {
        let inventory                   = {};
            inventory.dataVersion       = this.readInt();
            inventory.data              = [];

        let nbItems                     = this.readInt();

            for(let i = 0; i < nbItems; i++)
            {
                inventory.data.push({
                    name        : this.readString(),
                    qty         : this.readInt(),
                    durability  : this.readFloat(),
                    position    : {
                        row         : this.readInt(),
                        col         : this.readInt(),
                    },
                    isEquipped  : this.readByte(),
                    quality     : this.readInt(),
                    variant     : this.readInt(),
                    crafterId   : this.readUInt64(),
                    crafterName : this.readString()
                });
            }

        return inventory;
    }

    readArrayOfString()
    {
        let array       = [];
        let nbString    = this.readInt();

            for(let i = 0; i < nbString; i++)
            {
                array.push(this.readString());
            }

        return array;
    }

    readArrayOfInt()
    {
        let array       = [];
        let nbInt       = this.readInt();

            for(let i = 0; i < nbInt; i++)
            {
                array.push(this.readInt());
            }

        return array;
    }

    readStations()
    {
        let stations    = [];
        let nbStations  = this.readInt();

            for(let i = 0; i < nbStations; i++)
            {
                stations.push({
                    name    : this.readString(),
                    level   : this.readInt()
                });
            }

        return stations;
    }

    readTexts()
    {
        let texts       = [];
        let nbTexts     = this.readInt();

            for(let i = 0; i < nbTexts; i++)
            {
                texts.push({
                    unk1    : this.readString(),
                    unk2    : this.readString()
                });
            }

        return texts;
    }

    readFoods()
    {
        let foods       = [];
        let nbFoods     = this.readInt();

            for(let i = 0; i < nbFoods; i++)
            {
                foods.push({
                    name    : this.readString(),
                    hp      : this.readFloat(),
                    stamina : this.readFloat()
                });
            }

        return foods;
    }

    readSkills()
    {
        let skills              = {};
            skills.dataVersion  = this.readInt();
            skills.data         = [];

        let nbSkills            = this.readInt();

            for(let i = 0; i < nbSkills; i++)
            {
                skills.data.push({
                    id          : this.readInt(),
                    level       : this.readFloat(),
                    accumulator : this.readFloat()
                });
            }

        return skills;
    }

    /*
     * BYTES MANIPULATIONS
     */
    skipBytes(byteLength = 1)
    {
        this.currentByte += byteLength;
    }

    readByte()
    {
        return parseInt(this.bufferView.getUint8(this.currentByte++, true));
    }

    readHex(hexLength)
    {
        let hexPart = [];
            for(let i = 0; i < hexLength; i++)
            {
                hexPart.push(String.fromCharCode(
                    this.bufferView.getUint8(this.currentByte++, true)
                ));
            }

        return hexPart.join('');
    }

    readUInt8()
    {
        let data = this.bufferView.getUint8(this.currentByte++, true);
            return data;
    }

    readInt()
    {
        let data = this.bufferView.getInt32(this.currentByte, true);
        this.currentByte += 4;
        return data;
    }

    readUInt64()
    {
        let data = this.bufferView.getBigUint64(this.currentByte, true);
        this.currentByte += 8;
        return data;
    }

    readFloat()
    {
        let data = this.bufferView.getFloat32(this.currentByte, true);
        this.currentByte += 4;
        return data;
    }

    readVector3()
    {
        return {
            x: this.readFloat(),
            y: this.readFloat(),
            z: this.readFloat()
        };
    }

    readRGB()
    {
        return {
            r: this.readFloat(),
            g: this.readFloat(),
            b: this.readFloat()
        };
    }

    readString()
    {
        let strLength       = this.readUInt8();
        this.lastStrRead    = strLength;
        let startBytes      = this.currentByte;

        if(strLength === 0)
        {
            return '';
        }

        try
        {
            let utf8        = new ArrayBuffer(strLength);
            let utf8View    = new Uint8Array(utf8);

            for(let i = 0; i < strLength; i++)
            {
                utf8View[i] = this.bufferView.getUint8(this.currentByte++, true);
            }

            return String.fromCharCode.apply(null, utf8View);
        }
        catch(error)
        {
            this.currentByte = Math.max(0, startBytes - 512);

            let errorMessage = 'Cannot readString (' + strLength + '):' + error + ': `' + this.readHex(512) + '`=========`' + this.readHex(256) + '`';
                console.log(errorMessage);
                Modal.alert('Something went wrong while we were trying to parse your save game... Please try to contact us on Twitter or Discord!');
                throw new Error(errorMessage);
        }

        return;
    }
}