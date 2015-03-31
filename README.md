# Pufferfish.js

Loads images based on the amount of space available in the image's containing element.

This is still very much a proof of concept, so don't use it for anything important.

## Public Methods

### $.pufferfish.init()

Initialises images which have been added to a page asynchronously.

### $.pufferfish.reflow()

Force Pufferfish to re-calculate image sources using current container dimensions.

## Usage Example

    <style>
        .container{
            width: 50%;
            margin: 0 auto 0 auto;
        }

        img{
            width: 100%;
        }
    </style>

    <div class="container">
        <img data-pufferfish="[http://placehold.it/640x480, (max-width: 640)], [http://placehold.it/1200x500, (min-width: 641)]" />
    </div>

    <div class="container">
        <video src="video.mp4" data-pufferfish-src-attr="poster" data-pufferfish="[http://placehold.it/640x480, (max-width: 640)], [http://placehold.it/1200x500, (min-width: 641)]" />
    </div>

    <div class="responsive-background" data-pufferfish="[http://placehold.it/640x480, (max-width: 640)], [http://placehold.it/1200x500, (min-width: 641)]">
        <h2>Title</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas tincidunt ipsum eu porta.
            Nam pretium scelerisque urna et porttitor. Suspendisse commodo, magna id iaculis luctus, quam enim
            bibendum felis, vel volutpat lacus ante eget lectus.
        </p>
    </div>

    <script src="js/jquery.js"></script>
    <script src="js/pufferfish.js"></script>

    <script>
        // Initialise Pufferfish
        $(document).pufferfish({
            // Settings are optional
            'onChange': function(event){
                // Runs before the src attribute is changed
                if(event.element.is('.responsive-background')){
                    event.preventDefault();
                    event.element.css({
                        'background-image': 'url(' + event.newImageSrc + ')'
                    })
                }

            },
            'afterChange': function(event){
                // Runs after the src attribute has been changed
            }
        })
    </script>
