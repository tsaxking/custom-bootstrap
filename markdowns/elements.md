# CBS Elements
Here are the list of elements that come with CBS. You can also create your own elements using `CBS.addElement(name: string, constructor: new (options?: CBS_Options) => CBS_Element)`

- [CBS_Button](./elements/button.md)
- [CBS_Card](./elements/card.md)
- [CBS_Form](./elements/form.md)
- [CBS_Grid](./elements/grid.md)
- [CBS_Modal](./elements/modal.md)
- [CBS_ProgressBar](./elements/progress-bar.md)
- [CBS_Table](./elements/table.md)
- [CBS_Text](./elements/text.md)
- [CBS_List](./elements/list.md)

If you do make your own element, you must extend `CBS_Element` as such:
```typescript
class MyElement extends CBS_Element {
    constructor(options?: CBS_Options) {
        super(options);
    }

    // if you want to implement your own custom options, you must do this:
    // however, you don't have to do this if you don't need custom options
    // VVVVV
    set options(options: CBS_Options) {
        super.options = options;
        // do something with options
    }

    get options() {
        return this._options; // otherwise this will be undefined!
    }
    // ^^^^^
}

// then, add it to CBS
CBS.addElement("my-element", MyElement);
```

## Future Features
- Accordion
- Badge
- Breadcrumb
- Button Group
- Button Toolbar
- Carousel
- Dropdown
- Navigation
- Notifications
- Offcanvas
- Pagination
- Popover
- Scrollspy
- Spinners
- Toasts
- Tooltip

## Links
- [Home](../README.md)
- [Main](./main.md)