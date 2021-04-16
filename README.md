
# [Demo](https://edoardohorse.github.io/Carousel-customElement/)


# Variants
    
|name| Description|
|----------|-------------|
|*carousel-dotted*|Show a dotter bar that make you jump directly to a specific image
|*carousel-preview*|Show a bar with all previews of the images

# Syntax

```html
    <carousel-default
        size= big|[medium]|small 
        
        width=[350] height=[350]

        title = "Title"
        subtitle = "Subtitle"
        
        header-position = [top]|bottom
        header-above = [true]|false
        
        drag = true|[false]]
        loop = true|[false]]
        
        progression = true|[false]>

            <img src='img/foo.jpg'>
            <img src='img/foo2.jpg'>
            <img src='img/foo3.jpg'>
    </carousel-default>
```

```html
    <carousel-dotted> 
        <!-- Same attribute of carousel-default -->
    </carousel-dotted>

    <carousel-preview> 
        <!-- Same attribute of carousel-default -->
    </carousel-preview>

```



## Title & Subtitle: *string*
Give a title and a subtitle to the carousel

## Header

#### header-position: ([top] | bottom)
Header can be positioned **bottom** or **top** (default)

#### header-above: ([true] | false)

Header can lay above the images (z-Index greater) or make its own space.


## Size: (big | [medium] | small)  
|Value attribute| size
|----------|:-------------:|
|big| 500x500 px|
|medium|350x350 px|
|small|150x150 px|

#### Width & Height

Custom size can be setted by **width** and **height** attributes


## Drag: (true | [false])

Make the swipe available with mouse. 

## Loop: (true | [false])

Enable carousel to loop from first image to last one and viceversa.


## Progression: (true | [false])

Show a counter of n-th img showed


## CSS Variables

|Name|Default value
|-|:-:|
|carousel-btn-bg|rgba(0,0,0,.75)|
|carousel-btn-color|white|
|carousel-title-font-size|27px|
|carousel-subtitle-font-size|17px|
|carousel-size-big| 500px|
|carousel-size-medium| 350px|
|carousel-size-small| 150px|
|carousel-size-big-preview|150px|
|carousel-size-medium-preview|70px|
|carousel-transition-slide-duration|300ms|
|carousel-navigation-preview-opacity|1|
|carousel-cubic-bezier-material|cubic-bezier(0.4, 0.0, 0.2, 1)|
|carousel-font-size-progression|12px|
|carousel-size-width-custom|setted via [width](#width-height) attribute|
|carousel-size-height-custom|setted via [height](#width-height) attribute|


## Responsivness

Best way to get a responsive carousel

```css
@media screen and (max-width:600px) {
    carousel-default, carousel-dotted, carousel-preview{
        --size-width-custom: 100% !important;
        --size-height-custom: 70vw !important;
    }
}
```


---


### ⚠️ Important
- When **small** size and **title** are setted the [header-above](#header-above-true-false) behave as *false* and [header-position](#header-position-top-bottom) is setted as *top*
- When **small** size is setted the buttons are condensed at the bottom
- When **subtitle** is not setted the header is less height
- When display's width is less then 600px, **previews** are not shown in carousel-preview

---