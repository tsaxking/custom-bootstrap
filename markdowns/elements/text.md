# CBS_Text

All text elements are based on the `CBS_Text` class. This class is a subclass of the `CBS_Element` class and inherits all its properties and methods.


## Getters and Setters
`(CBS_Element).text` gets/sets `element.innerText`;

`(CBS_Element).html` gets/sets `element.innerHTML`;

`(CBS_Element).color` is the custom bootstrap color and only takes the enum `CBS_Color`;

`(CBS_Element).size` uses `CBS_Size` enum to create the font size

`(CBS_Element).weight` uses `CBS_Weight` enum to create the font weight

`(CBS_Element).align` uses `CBS_Align` enum to align the text differently


## Elements

All of the below elements use the above properties.
`CBS.createElement('a')` creates `<a></a>`
`CBS.createElement('p')` creates `<p></p>`
`CBS.createElement('span')` creates `<span></span>`
`CBS.createElement('h1')` creates `<h1></h1>`
`CBS.createElement('h2')` creates `<h2></h2>`
`CBS.createElement('h3')` creates `<h3></h3>`
`CBS.createElement('h4')` creates `<h4></h4>`
`CBS.createElement('h5')` creates `<h5></h5>`
`CBS.createElement('h6')` creates `<h6></h6>`