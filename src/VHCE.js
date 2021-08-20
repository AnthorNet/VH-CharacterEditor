import Character                                from './Character.js';
import Modal                                    from './Modal.js';
import SaveParser                               from './SaveParser.js';

export default class VHCE
{
    constructor()
    {
        this.build                      = 'EarlyAccess';
        this.debug                      = false;
        this.language                   = 'en';

        this.outlineClass               = 'btn-outline-warning focus';

        this.gameDataUrl                = "https://valheim-calculator.com/" + this.language + "/api/game";

        // Updater notice
        this.scriptsVERSION             = Math.floor(Math.random() * Math.floor(999));
        this.urlScriptsVERSION          = null;
        this.intervalScriptsVERSION     = null;

        // Hold...
        this.character                  = null;
    }

    start()
    {
        if(this.urlScriptsVERSION !== null)
        {
            this.intervalScriptsVERSION = setInterval(this.checkVersion.bind(this), 300 * 1000);
        }

        if(window.File && window.FileReader && window.FileList && window.Blob)
        {
            $('#dropSaveGame').on('drag dragstart dragend dragover dragenter dragleave drop', function(e){e.preventDefault();e.stopPropagation();})
                              .on('dragover dragenter', function(){$('#dropSaveGame').addClass('is-dragover');})
                              .on('dragleave dragend drop', function(){$('#dropSaveGame').removeClass('is-dragover');})
                              .on('drop', function(e){ this.processSaveGameFile(e.originalEvent.dataTransfer.files[0]); }.bind(this));
            $('#saveGameFileInput').on('change', function(e){
                let currentFile = $(e.currentTarget).prop('files')[0];
                    $(this).val('');

                this.processSaveGameFile(currentFile);
            }.bind(this));
        }
        else
        {
            $('#dropSaveGame').remove();
        }
    }

    processSaveGameFile(droppedFile)
    {
        if(droppedFile !== undefined)
        {
            if(droppedFile.name.endsWith('.fch'))
            {
                this.showLoader();

                let reader = new FileReader();
                    reader.readAsArrayBuffer(droppedFile);
                    reader.onload = function(){
                        this.handleNewCharacter({
                            droppedFileResult       : reader.result,
                            droppedFileName         : droppedFile.name
                        });
                    }.bind(this);
            }
            else
            {
                alert('File should be name XXX.fch');
            }
        }
        else
        {
            alert('Something went wrong reading your save file!');
        }
    }

    handleNewCharacter(options)
    {
        if(this.character !== null)
        {
            this.character.reset();
        }

        setTimeout(function(){
            options.build           = this.build;
            options.debug           = this.debug;

            options.staticUrl       = this.staticAssetsUrl;
            options.dataUrl         = this.gameDataUrl;
            options.modsUrl         = this.modsDataUrl;

            options.language        = this.language;
            options.version         = this.scriptsVERSION;

            options.saveGameParser  = new SaveParser(options.droppedFileResult, options.droppedFileName);

            this.character          = new Character(options);
            this.character.draw();
        }.bind(this), 250);
    }



    showLoader()
    {
        let tips = [];
            if(tips.length > 0)
            {
                $('.loader .tips').show();
                $('.loader .tips .speech-bubble em').html(tips[Math.floor(Math.random() * tips.length)]);
            }

        $('#fileLocation').hide();
        $('.loader').addClass('spinning');
        $('.loader h6').html('Loading...');
        $('#dropSaveGame').hide();
        $('#downloadSaveGameModalButton').hide();
        $('#saveGameLoader').show();
        $('.loader').show();
    }

    hideLoader()
    {
        $('.loader').hide();
        $('#saveGameLoader').hide();
        $('#loaderProgressBar').hide();

        if(this.character !== null)
        {
            $('#downloadSaveGameModalButton').show();
            $('#dropSaveGame small').remove();
        }

        $('#dropSaveGame').show();
    }


    checkVersion(currentVersion)
    {
        let alertMessage = "Good news, a new version of the character editor was released! Please refresh your page / browser cache to make sure you'll get the latest fixes and features.";

        if(currentVersion !== undefined && currentVersion !== null)
        {
            if(currentVersion > this.scriptsVERSION)
            {
                Modal.alert(alertMessage);
                return false;
            }
        }
        else
        {
            if(this.urlScriptsVERSION !== null)
            {
                $.get(this.urlScriptsVERSION, function(data){
                    if(data > this.scriptsVERSION)
                    {
                        Modal.alert(alertMessage);
                        clearInterval(this.intervalScriptsVERSION);
                        return false;
                    }
                });
            }
        }

        return true;
    };
}
window.VHCE = new VHCE();