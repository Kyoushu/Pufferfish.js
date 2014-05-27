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

    <script src="js/jquery.js"></script>
    <script src="js/pufferfish.js"></script>

    <script>$(document).pufferfish()</script>
