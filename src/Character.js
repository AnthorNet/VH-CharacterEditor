import Modal                                    from './Modal.js';

export default class Character
{
    constructor(options)
    {
        this.useDebug                           = (options.debug !== undefined) ? options.debug : false;
        this.useBuild                           = (options.build !== undefined) ? options.build : 'EarlyAccess';
        this.scriptVersion                      = (options.version !== undefined) ? options.version : Math.floor(Math.random() * Math.floor(9999999999));
        this.staticUrl                          = options.staticUrl;

        this.saveGameParser                     = options.saveGameParser;
    }

    draw()
    {
        this.saveGameParser.load(function(){
            // Show stats


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
        }.bind(this));
    }

    reset()
    {
        $('#downloadSaveGame').off('click');
        
        $('#saveGameInformation').empty();
        $('#playerNav').hide();
    }
}