export default class Character_Player
{
    constructor(character)
    {
        this.character      = character;
        this.player         = this.character.saveGameParser.player;
    }

    parse()
    {
        let content = [];
            content.push('<h4 class="mb-3">Player</h4>');
            content.push('<input type="text" class="form-control text-center mb-3" value="' + this.player.name + '" maxlength="15">');

            // Stats
            content.push('<div class="row row-cols-2 row-cols-md-4">');

                content.push('<div class="col text-center">');
                    content.push('<h6 class="mb-1">Kills</h6>');
                    content.push('<i class="far fa-swords fa-3x"></i><br />');
                    content.push('<h5 class="mt-1">' + this.character.saveGameParser.stats.kills + '');
                content.push('</div>');

                content.push('<div class="col text-center">');
                    content.push('<h6 class="mb-1">Deaths</h6>');
                    content.push('<i class="far fa-tombstone fa-3x"></i><br />');
                    content.push('<h5 class="mt-1">' + this.character.saveGameParser.stats.deaths + '</h5>');
                content.push('</div>');

                content.push('<div class="col text-center">');
                    content.push('<h6 class="mb-1">Crafts</h6>');
                    content.push('<i class="far fa-backpack fa-3x"></i><br />');
                    content.push('<h5 class="mt-1">' + this.character.saveGameParser.stats.crafts + '</h5>');
                content.push('</div>');

                content.push('<div class="col text-center">');
                    content.push('<h6 class="mb-1">Builds</h6>');
                    content.push('<i class="far fa-house fa-3x"></i><br />');
                    content.push('<h5 class="mt-1">' + this.character.saveGameParser.stats.builds + '</h5>');
                content.push('</div>');

            content.push('</div>');

            // Health
            content.push('<hr class="bg-secondary" />');
            content.push('<div class="row">');
                content.push('<div class="col mb-5">');
                    content.push('<div class="progress bg-secondary">');
                        content.push('<div class="progress-bar bg-success" style="width: ' + (this.player.data.health / this.player.data.maxHealth * 100) + '%;"></div>');
                    content.push('</div>');
                content.push('</div>');
            content.push('</div>');

            content.push('<div class="row row-cols-1 row-cols-md-3">');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Health</h6>');
                    content.push('<div class="input-group text-center">');
                        content.push('<div class="input-group-prepend"><span class="input-group-text bg-secondary">-</span></div>');
                        content.push('<input type="text" class="form-control text-center" value="' + this.player.data.health + '">');
                        content.push('<div class="input-group-append"><span class="input-group-text bg-secondary">+</span></div>');
                    content.push('</div>');
                content.push('</div>');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Max health</h6>');
                    content.push('<div class="input-group text-center">');
                        content.push('<div class="input-group-prepend"><span class="input-group-text bg-secondary">-</span></div>');
                        content.push('<input type="text" class="form-control text-center" value="' + this.player.data.maxHealth + '">');
                        content.push('<div class="input-group-append"><span class="input-group-text bg-secondary">+</span></div>');
                    content.push('</div>');
                content.push('</div>');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Stamina</h6>');
                    content.push('<div class="input-group text-center">');
                        content.push('<div class="input-group-prepend"><span class="input-group-text bg-secondary">-</span></div>');
                        content.push('<input type="text" class="form-control text-center" value="' + this.player.data.stamina + '">');
                        content.push('<div class="input-group-append"><span class="input-group-text bg-secondary">+</span></div>');
                    content.push('</div>');
                content.push('</div>');

            content.push('</div>');

            // Look
            content.push('<hr class="bg-secondary" />');
            content.push('<h5 class="text-center">Look</h5>');
            content.push('<div class="row row-cols-1 row-cols-md-3">');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Sex</h6>');
                    content.push('<select name="playerDataModel" class="form-control">');
                        content.push('<option name="0"' + ((this.player.data.model === 0) ? ' selected':'') + '>Male</option>');
                        content.push('<option name="1"' + ((this.player.data.model === 1) ? ' selected':'') + '>Female</option>');
                    content.push('</select>');
                content.push('</div>');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Beard</h6>');
                    content.push('<select name="playerDataBeard" class="form-control">');
                        content.push('<option name="BeardNone"' + ((this.player.data.beard === 'BeardNone') ? ' selected':'') + '>No beard</option>');
                        for(let i = 1; i <= 14; i++)
                        {
                            content.push('<option name="Beard' + i + '"' + ((this.player.data.beard === 'Beard' + i) ? ' selected':'') + '>Beard ' + i + '</option>');
                        }
                    content.push('</select>');
                content.push('</div>');

                content.push('<div class="col">');
                    content.push('<h6 class="mb-1">Hair</h6>');
                    content.push('<select name="playerDataHair" class="form-control">');
                        content.push('<option name="HairNone"' + ((this.player.data.hair === 'HairNone') ? ' selected':'') + '>No hair</option>');
                        for(let i = 1; i <= 14; i++)
                        {
                            content.push('<option name="Hair' + i + '"' + ((this.player.data.hair === 'Hair' + i) ? ' selected':'') + '>Hair ' + i + '</option>');
                        }
                    content.push('</select>');
                content.push('</div>');

            content.push('</div>');

        return content.join('');
    }
}