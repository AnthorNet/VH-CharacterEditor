export default class Character_Skills
{
    static get availableSkills(){ return {
        2   : 'Knives',
        3   : 'Clubs',
        6   : 'Blocking',
        7   : 'Axes',
        8   : 'Bows',
        11  : 'Unarmed',
        12  : 'Pickaxes',
        13  : 'Woodcutting',
        100 : 'Jump',
        101 : 'Sneaking',
        102 : 'Running',
        103 : 'Swim'
    }; }

    constructor(character)
    {
        this.character      = character;
        this.skills         = this.character.saveGameParser.player.data.skills;
    }

    parse()
    {
        let content = [];
            content.push('<h4 class="mb-3">Skills</h4>');

            content.push('<div class="alert alert-warning text-center">Work in progress...</div>');

            for(let key in Character_Skills.availableSkills)
            {
                let currentSkill = this.getSkill(key);

                content.push('<div class="row row-cols-2">');
                    content.push('<div class="col">');
                        content.push('<h6>' + Character_Skills.availableSkills[key] + '</h6>');
                    content.push('</div>');
                    content.push('<div class="col text-right">');
                        if(currentSkill !== null)
                        {
                            content.push('Level ' + currentSkill.level);
                        }
                        else
                        {
                            content.push('<strong>+</strong>');
                        }
                    content.push('</div>');
                content.push('</div>');

                content.push('<div class="row">');
                    content.push('<div class="col">');

                        if(currentSkill !== null)
                        {
                            content.push('<div class="progress bg-secondary">');
                                content.push('<div class="progress-bar bg-danger" style="width: ' + (currentSkill.accumulator / 99 * 100) + '%;"></div>');
                            content.push('</div>');
                        }

                    content.push('</div>');
                content.push('</div>');

                content.push('<hr class="bg-secondary" />');
            }

            return content.join('');
    }

    getSkill(id)
    {
        for(let i = 0; i < this.skills.data.length; i++)
        {
            if(this.skills.data[i].id === parseInt(id))
            {
                return this.skills.data[i];
            }
        }

        return null;
    }
}