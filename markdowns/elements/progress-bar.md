# CBS_ProgressBar

The CBS_ProgressBar is a simple class that can be used to give a visual representation of a percentage.

## Example

```typescript
const bar = CBS.createElement('progress-bar');

document.body.append(bar.el);

const interval = setInterval(() => {
    bar.progress += 10;
    if (bar.progress >= 100) {
        clearInterval(interval);
    }
}, 1000);

```