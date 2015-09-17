# Pufferfish.js

[![Build Status](https://travis-ci.org/Kyoushu/Pufferfish.js.svg?branch=master)](https://travis-ci.org/Kyoushu/Pufferfish.js)

A responsive image loader which uses the size of an image's containing element to determine which image should be loaded.
 
The rationale behind the library is to simplify the process of loading images in responsive grids. The rules for loading
images do not need to be changed, even after drastically changing the layout of a page.

## Public Methods

### $.pufferfish.init(context, settings)

Initialises images which have been added to a page asynchronously.

### $.pufferfish.reflow()

Force Pufferfish to re-calculate image sources using current container dimensions.

## Settings

### onChange

Type: function(event)

Called before the src attribute of an image is changed

### afterChange

Type: function(event)

Called after the src atribute of an image is changed. Does not run if event.preventDefault() is called in onChange()

## Objects

### PufferfishImageChangeEvent

#### Properties

##### element

Type: object | jQuery element

##### newImageSrc

Type: string

##### oldImageSrc

Type: string

#### Methods

##### preventDefault()

Stops Pufferfish from setting the image src attribute 

## Usage Example

Pufferfish is initialised for an entire page in the following way

    $(document).pufferfish();
    
Specific elements can also be initialised

    $('.image-container').pufferfish();
    
Settings can also be passed

    $(document).pufferfish({
        'onChange': function(event){
            // Do something here
        }
    });

The data-pufferfish attribute contains the definitions of images to be loaded based on the width of the containing element. The first matching definition is used.

A single definition uses the following syntax

    [image/url/goes/here.jpg, (min-width: 100, max-width: 200)]
    
You can use the dimension constraints min-width and max-width. At least one or both must be used in each definition.
    
Multiple definitions are comma separated

    [image1.jpg, (min-width: 100, max-width: 199)], [image2.jpg, (min-width: 200)]

When used in an <img> element, it looks like this.

    <img data-pufferfish="[http://placehold.it/640x480, (max-width: 640)], [http://placehold.it/1200x500, (min-width: 641)]" />
    
The image loader can be used to change different element attributes by using data-pufferfish-src-attr.

In the following example, the poster attribute is changed in a <video> element instead of the src attribute.
    
    <video src="video.mp4" data-pufferfish-src-attr="poster" data-pufferfish="[image1.jpg, (max-width: 640)], [image2.jpg, (min-width: 641)]" />
    
You can also override the default behaviour of Pufferfish by using the onChange callback.

    <div class="responsive-background" data-pufferfish="[image1.jpg, (max-width: 640)], [image2.jpg, (min-width: 641)]">
        <h2>Title</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas tincidunt ipsum eu porta.
            Nam pretium scelerisque urna et porttitor. Suspendisse commodo, magna id iaculis luctus, quam enim
            bibendum felis, vel volutpat lacus ante eget lectus.
        </p>
    </div>

    <script>
        
        $(document).pufferfish({
            'onChange': function(event){
                
                if(event.element.is('.responsive-background')){
                    event.preventDefault();
                    event.element.css({
                        'background-image': 'url(' + event.newImageSrc + ')'
                    })
                }

            }
        })
    </script>