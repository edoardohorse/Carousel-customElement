
# [Demo](https://edoardohorse.github.io/Carousel-customElement/)


# Variants
    
|name| Description|
|----------|:-------------:|
|*carousel-dottedbar*|Show a dotter bar that make you jump directly to a specific image
|*carousel-previewbar*|Show a bar with all previews of the images


---


## Title & Subtitle: *string*
Give a title and a subtitle to the carousel

---

## Header

### *header-position*: ([top] | bottom)
Header can be positioned **bottom** or **top** (default)

### *header-above*: ([true] | false)

Header can lay above the images (z-Index greater) or make its own space.

---

## Size: (big | [medium] | small)  
|Value attribute| size
|----------|:-------------:|
|big| 500x500 px|
|medium|350x350 px|
|small|150x150 px|

Custom size can be setted by **width** and **height** attribute

---

## *Drag*: (true | [false])

Make the swipe available with mouse. 

---

## *Loop*: (true | [false])

Enable carousel to loop from first image to last one and viceversa.


---

## *Progression*: (true | [false])

Show a counter of n-th img showed

---

### CSS Variables

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
|carousel-size-width-custom|setted via [width](#width-height) attribute|
|carousel-size-height-custom|setted via [height](#width-height) attribute|
---


### ⚠️ Important
- When **small** size and **title** are setted the [header-above](#header-above-true-false) behave as *false* and [header-position](#header-position-top-bottom) is setted as *top*
- When **small** size is setted the buttons are condensed at the bottom
- When **subtitle** is not setted the header is less height
- When **navigation** is setted to *preview* <u>and</u> [size](#size) is *small*, bar it's not showed

---


# Complete syntax

```html
    <custom-carousel
        size='big|[medium]|small' or width='[350px]' height='[350px]'

        title='Title'
        subtitle='Subtitle'
        
        header-position='[top]|bottom'
        header-above='[true]|false'
        
        drag = 'true|[false]']
        loop = 'true|[false]']>

            <img src='img/foo.jpg'>
            <img src='img/foo2.jpg'>
            <img src='img/foo3.jpg'>
    </custom-carousel>
```

```html
    <carousel-dottedbar> 
        <!-- Same attribute of custom-carousel -->
    </carousel-dottedbar>

    <carousel-previewbar> 
        <!-- Same attribute of custom-carousel -->
    </carousel-previewbar>

```
