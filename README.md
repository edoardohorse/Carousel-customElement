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

```