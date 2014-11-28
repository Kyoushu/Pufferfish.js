(function($, window, document, undefined){
    
    var PufferfishImageChangeEvent = function(element, newImageSrc, oldImageSrc){
        this.element = element;
        this.newImageSrc = newImageSrc;
        this.oldImageSrc = oldImageSrc;
    }

    PufferfishImageChangeEvent.prototype.element = null;
    PufferfishImageChangeEvent.prototype.newImageSrc = null;
    PufferfishImageChangeEvent.prototype.oldImageSrc = null;
    PufferfishImageChangeEvent.prototype.isDefaultPrevented = false;

    PufferfishImageChangeEvent.prototype.preventDefault = function(){
        this.isDefaultPrevented = true;
    }

    var defaults = {
        'onChange': function(element, newImageSrc, oldImageSrc){}
    };

    $.pufferfish = (function(){

        var settings = $.extend({}, defaults);

        var sizeDefinitionRegex =       /\[([^,]+)(\s+)?,(\s+)?\(([^\)]+)\)(\s+)?\]/;
        var sizeDefinitionRegexGlobal = /\[([^,]+)(\s+)?,(\s+)?\(([^\)]+)\)(\s+)?\]/g;
        var constraintRegex =       /([^,\s:]+):(\s+)?([^,]+)/;
        var constraintRegexGlobal = /([^,\s:]+):(\s+)?([^,]+)/g;
        
        var watchedImages = [];

        function getDataAttrKey(name){
            return 'data-pufferfish' + (typeof name !== 'undefined' ? '-' + name : '');
        }
        
        function getDataAttrSelector(name){
            return '[' + getDataAttrKey(name) + ']';
        }
        
        function parseConstraints(constraintString){
            
            var defaults = {
                'max-width': null,
                'min-width': null
            };
            
            var constraints = {};
            
            var constraintStringParts = constraintString.match(constraintRegexGlobal);
            constraintStringParts.forEach(function(constraintStringPart){
                var constraintVars = constraintStringPart.match(constraintRegex);
                constraints[constraintVars[1]] = parseInt(constraintVars[3]);
            });
            
            return $.extend({}, defaults, constraints);
            
        }
        
        function parseSizeDefinitions(sizeDefString){
            
            var sizeDefStringParts = sizeDefString.match(sizeDefinitionRegexGlobal);
            var sizeDefs = [];
            
            sizeDefStringParts.forEach(function(sizeDefStringPart){
                var sizeDefVars = sizeDefStringPart.match(sizeDefinitionRegex);
                
                sizeDefs.push({
                    'src': sizeDefVars[1],
                    'constraints': parseConstraints(sizeDefVars[4])
                });
                
            });
            
            return sizeDefs;
            
        }
        
        function watchImage(img){
            
            var sizeDefString = img.attr( getDataAttrKey() );
            var sizeDefinitions = parseSizeDefinitions(sizeDefString);
            
            var srcAttr = img.attr( getDataAttrKey('src-attr') );
            if(!srcAttr) srcAttr = 'src';
            
            img.data( getDataAttrKey('watched'), true );
            
            watchedImages.push({
                'img': img,
                'sizeDefinitions': sizeDefinitions,
                'srcAttr': srcAttr,
                'currentSrc': null
            });
        
        }
        
        function reflow(){
            
            watchedImages.forEach(function(watchedImage){
                
                var img = watchedImage.img;
                var sizeDefinitions = watchedImage.sizeDefinitions;
                var container = img.parent();
                var availableWidth = container.innerWidth();
                
                var selectedSizeDefinition = null;
                
                $.each(sizeDefinitions, function(key, sizeDefinition){
                    
                    if(
                        sizeDefinition.constraints['min-width'] !== null &&
                        availableWidth < sizeDefinition.constraints['min-width']
                    ){
                        return;
                    }
                    
                    if(
                        sizeDefinition.constraints['max-width'] !== null &&
                        availableWidth > sizeDefinition.constraints['max-width']
                    ){
                        return;
                    }
                    
                    selectedSizeDefinition = sizeDefinition;
                    return false;
                    
                });
                
                if(selectedSizeDefinition !== null && watchedImage.currentSrc !== selectedSizeDefinition.src){

                    var oldImageSrc = watchedImage.currentSrc;
                    var newImageSrc = selectedSizeDefinition.src;

                    watchedImage.currentSrc = newImageSrc;

                    var event = new PufferfishImageChangeEvent(img, newImageSrc, oldImageSrc);
                    settings.onChange(event);

                    if(!event.isDefaultPrevented){
                        img.attr(watchedImage.srcAttr, newImageSrc);
                    }

                }
            
            });
            
        }
        
        function bindUnwatched(context){
            if(typeof context === 'undefined') context = document;
            $(context).find( getDataAttrSelector() ).each(function(){
                var img = $(this);
                if(img.data( getDataAttrKey('watched') )) return;
                watchImage(img);
            });
        }
        
        function init(context, _settings){
            settings = $.extend({}, defaults, _settings);
            if(typeof context === 'undefined') context = document;
            bindUnwatched(context);
            reflow();
        }
        
        // Public methods
        return {
            'init': init,
            'reflow': reflow
        };
        
    })();

    $.fn.pufferfish = function(settings){
        $.pufferfish.init(this, settings);
        $(window).on('resize', function(){
            $.pufferfish.reflow();
        });
    };
    
})( jQuery, window, window.document);
