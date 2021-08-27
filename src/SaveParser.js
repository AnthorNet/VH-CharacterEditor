import SaveParser_Read      from './SaveParser/Read.js';
import SaveParser_Write     from './SaveParser/Write.js';

export default class SaveParser
{
    constructor(arrayBuffer, fileName)
    {
        this.fileName               = fileName;
        this.arrayBuffer            = arrayBuffer;

        this.header                 = null;
    }

    load(callback = null)
    {
        this.header             = null;

        new SaveParser_Read({
            saveParser  : this,
            callback    : callback
        });
    }

    save(callback = null)
    {
        let writer = new SaveParser_Write({
            saveParser  : this,
            callback    : callback
        });
            writer.streamSave();
    }

    getHeader()
    {
        return this.header;
    }
}