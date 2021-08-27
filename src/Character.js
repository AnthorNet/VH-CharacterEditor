import Modal                                    from './Modal.js';

import Character_Foods                          from './Character/Foods.js';
import Character_Inventory                      from './Character/Inventory.js';
import Character_Player                         from './Character/Player.js';
import Character_Skills                         from './Character/Skills.js';
import Character_Trophies                       from './Character/Trophies.js';

export default class Character
{
    constructor(options)
    {
        this.useDebug                           = (options.debug !== undefined) ? options.debug : false;
        this.useBuild                           = (options.build !== undefined) ? options.build : 'EarlyAccess';
        this.scriptVersion                      = (options.version !== undefined) ? options.version : Math.floor(Math.random() * Math.floor(9999999999));

        this.dataUrl                            = options.dataUrl;
        this.buildingsData                      = null;
        this.itemsData                          = null;
        this.toolsData                          = null;
        this.recipesData                        = null;

        this.saveGameParser                     = options.saveGameParser;
    }

    draw()
    {
        this.saveGameParser.load(function(){
            if(this.buildingsData === null)
            {
                return new Promise(function(resolve){
                    $('#loaderProgressBar .progress-bar').css('width', '75%');
                    $('.loader h6').html('Loading game data...');
                    setTimeout(resolve, 50);
                }.bind(this)).then(() => {
                    $.getJSON(this.dataUrl + '?v=' + this.scriptVersion, function(data)
                    {
                        this.modsData       = data.modsData;
                        this.buildingsData  = data.buildingsData;
                        this.itemsData      = data.itemsData;
                        this.toolsData      = data.toolsData;
                        this.recipesData    = data.recipesData;

                        this.finalize();
                    }.bind(this));
                });
            }

            return this.finalize();
        }.bind(this));
    }

    finalize()
    {
        return new Promise(function(resolve){
            $('#loaderProgressBar .progress-bar').css('width', '100%');
            $('.loader h6').html('Rendering UI...');
            setTimeout(resolve, 25);
        }.bind(this)).then(() => {
            // Generate tabs
            let player = new Character_Player(this);
                $('#playerNav-player').html(player.parse());
            let skills = new Character_Skills(this);
                $('#playerNav-skills').html(skills.parse());
            let inventory = new Character_Inventory(this);
                $('#playerNav-inventory').html(inventory.parse());
            let foods = new Character_Foods(this);
                $('#playerNav-foods').html(foods.parse());
            let trophies = new Character_Trophies(this);
                $('#playerNav-trophies').html(trophies.parse());


            // End...
            window.VHCE.hideLoader();
            $('#playerNav').show();

            // Add download event
            $('#downloadSaveGame').on('click', () => {
                window.VHCE.showLoader();
                $('.loader h6').html('Saving...');

                // Save...
                this.saveGameParser.save();
            });
        });
    }

    reset()
    {
        $('#downloadSaveGame').off('click');

        $('#saveGameInformation').empty();
        $('#playerNav').hide();

        $('#playerNav-player').empty().addClass('show active');
    }

    getItemByClassName(className)
    {
        if(this.itemsData[className] !== undefined)
        {
           return this.itemsData[className];
        }

        for(let key in this.itemsData)
        {
            if(this.itemsData[key].className !== undefined && this.itemsData[key].className === className)
            {
                return this.itemsData[key].className;
            }
            if(this.itemsData[key].altClassName !== undefined && this.itemsData[key].altClassName === className)
            {
                return this.itemsData[key].altClassName;
            }
        }

        return this.getToolByClassName(className);
    }

    getToolByClassName(className)
    {
        if(this.toolsData[className] !== undefined)
        {
           return this.toolsData[className];
        }

        for(let key in this.toolsData)
        {
            if(this.toolsData[key].className !== undefined && this.toolsData[key].className === className)
            {
                return this.toolsData[key].className;
            }
            if(this.toolsData[key].altClassName !== undefined && this.toolsData[key].altClassName === className)
            {
                return this.toolsData[key].altClassName;
            }
        }

        return null;
    }
}