## Title & Subtitle: *string*
Give a title and a subtitle to the carousel


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

### ⚠️ Important
- When **small** size and **title** are setted the [header-above](#header-above-true-false) behave as *false* and [header-position](#header-position-top-bottom) is setted as *top*
- When **small** size is setted the buttons are condensed at the bottom

---



# Complete syntax

```html
    <custom-carousel
        size='big|[medium]|small'
        width='[350px]'
        height='[350px]'

        title='Title'
        subtitle='Subtitle'
        
        header-position='[top]|bottom'
        header-above='[true]|false'>

            <img data-src='img/foo.jpg'>
            <img data-src='img/foo2.jpg'>
            <img data-src='img/foo3.jpg'>
    </custom-carousel>
```