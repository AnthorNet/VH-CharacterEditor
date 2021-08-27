export default class Character_Foods
{
    constructor(character)
    {
        this.character      = character;
    }

    parse()
    {
        let content = [];
            content.push('<h4 class="mb-3">Foods</h4>');

            content.push('<div class="alert alert-warning text-center">Work in progress...</div>');

            return content.join('');
    }
}