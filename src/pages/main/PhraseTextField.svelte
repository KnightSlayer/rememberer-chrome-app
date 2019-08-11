<script>
    // hsl ([0-360], 99, 69)
    export let text;
    export let selections;

    let thisEl;

    const selectionHandler = () => {
        const selection = document.getSelection();
        const { anchorNode, focusNode, isCollapsed, anchorOffset, focusOffset } = selection;

        if (isCollapsed) return;

        const [startPos, finishPos] = anchorOffset > focusOffset ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset];

        const selectionNodes = [anchorNode, focusNode];

        const isSelectionInThisElement = selectionNodes.every(node => node.parentElement === thisEl);

        if (isSelectionInThisElement) {
            console.log(selection, selection.toString());
            console.log('start at ', startPos);
            console.log('length is ', finishPos - startPos);
        }
    };

    const onFocus = () => document.addEventListener('selectionchange', selectionHandler);
    const onBlur = () => document.removeEventListener('selectionchange', selectionHandler);
</script>

<style>
    .item {
        border: 1px solid #333;
        border-radius: 3px;
        padding: 0.5em;

        flex: 1 1;
    }
    .item + .item {
        margin-left: 1em;
    }
</style>

<div bind:this="{thisEl}"
     tabindex="0"
     on:focus={onFocus}
     on:blur={onBlur}
     class="item"
>
  { text }
</div>
