# CBS_Modal

## Overview
The CBS_Modal class is a component that allows you to create a modal window. It is a wrapper for the [Bootstrap Modal](https://getbootstrap.com/docs/5.0/components/modal/) component.

## Usage

```typescript
const modal = CBS.createElement('modal');
modal.title = 'Modal Title';
modal.body = 'Modal Body';
modal.footer = 'Modal Footer';
```
Will create:

```html
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Modal Body
      </div>
      <div class="modal-footer">
        Modal Footer
      </div>
    </div>
  </div>
</div>
```

You can easily add buttons to the footer by using the `options.buttons` property:

```typescript
const save = CBS.createElement('button', {
    outlined: true,
    color: CBS_Color.primary
});
save.append('Save');
const cancel = CBS.createElement('button', {
    outlined: true,
    color: CBS_Color.secondary
});
cancel.append('Cancel');

const modal = CBS.createElement('modal', {
    buttons: [
        save,
        cancel
    ]
});


```