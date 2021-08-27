export default class Character_Inventory
{
    constructor(character)
    {
        this.character      = character;
        this.inventory      = this.character.saveGameParser.player.data.inventory;
    }

    parse()
    {
        let content = [];
            content.push('<h4 class="mb-3">Inventory</h4>');
            content.push('<div class="alert alert-warning text-center">Work in progress...</div>');

            for(let y = 0; y < 4; y++)
            {
                content.push('<div class="row row-cols-8">');

                for(let x = 0; x < 8; x++)
                {
                    let currentSlot = this.getSlot(x, y);
                        content.push('<div class="col mb-4">');
                        content.push('<div class="embed-responsive embed-responsive-1by1"><div class="embed-responsive-item bg-secondary border border-dark rounded d-flex align-items-center"><div class="w-100 d-block text-center">');

                        if(currentSlot !== null)
                        {
                            let itemData = this.character.getItemByClassName(currentSlot.name);
                                //console.log(currentSlot, itemData);

                                if(itemData !== null)
                                {
                                    content.push('<h6>' + itemData.name + ' <em>(x' + currentSlot.qty + ')</em></h6>');
                                    content.push('<img src="' + itemData.image + '" class="img-fluid px-4">');

                                }
                                else
                                {
                                    content.push('<h6>' + currentSlot.name + ' <em>(x' + currentSlot.qty + ')</em></h6>');
                                    content.push('Missing data...');
                                }




                        }
                        else
                        {
                            content.push('<strong style="font-size: 48px;">+</strong>');
                        }

                        content.push('</div></div></div>');
                        content.push('</div>');
                }

                content.push('</div>');
            }



            return content.join('');
    }

    getSlot(x, y)
    {
        for(let i = 0; i < this.inventory.data.length; i++)
        {
            if(this.inventory.data[i].position.row === x && this.inventory.data[i].position.col === y)
            {
                return this.inventory.data[i];
            }
        }

        return null;
    }
}