(function($, window, document, undefined){
    
    var namespace = 'pufferfish';
    
    var pufferfish = (function(){
        
        var sizeDefinitionRegex =       /\[([^,]+)(\s+)?,(\s+)?\(([^\)]+)\)(\s+)?\]/;
        var sizeDefinitionRegexGlobal = /\[([^,]+)(\s+)?,(\s+)?\(([^\)]+)\)(\s+)?\]/g;
        var constraintRegex =       /([^,\s:]+):(\s+)?([^,]+)/;
        var constraintRegexGlobal = /([^,\s:]+):(\s+)?([^,]+)/g;
        
        var watchedImages = [];
        
        function getWatchedImages(){
            return watchedImages;
        }
        
        function getDataAttrKey(name){
            return 'data-' + namespace + (typeof name !== 'undefined' ? '-' + name : '');
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
            
            img.data( getDataAttrKey('watched'), true );
            
            watchedImages.push({
                'img': img,
                'sizeDefinitions': sizeDefinitions,
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
                        availableWidth >= sizeDefinition.constraints['max-width']
                    ){
                        return;
                    }
                    
                    selectedSizeDefinition = sizeDefinition;
                    return false;
                    
                });
                
                if(selectedSizeDefinition !== null && watchedImage.currentSrc !== selectedSizeDefinition.src){
                    watchedImage.currentSrc = selectedSizeDefinition.src;
                    img.attr('src', selectedSizeDefinition.src);
                }
            
            });
            
        }
        
        function bindUnwatched(context){
            if(typeof context === 'undefined') context = document;
            $(context).find( 'img' + getDataAttrSelector() ).each(function(){
                var img = $(this);
                if(img.data( getDataAttrKey('watched') )) return;
                watchImage(img);
            });
        }
        
        function init(context){
            if(typeof context === 'undefined') context = document;
            bindUnwatched(context);
            reflow();
        }
        
        // Public methods
        return {
            'init': init,
            'reflow': reflow,
            'getWatchedImages': getWatchedImages
        };
        
    })();
    
    window[namespace] = pufferfish;
    
    $.fn[namespace] = function(){
        window[namespace].init(this);
        $(window).on('resize', function(){
            window[namespace].reflow(); 
        });
    };
    
})(jQuery, window, window.document);