<script>
    export let text;
    export let selections;

    let thisEl;

    const selectionHandler = () => {
        const selection = document.getSelection();
        const { anchorNode, baseNode, extentNode, focusNode } = selection;
        const selectionNodes = [anchorNode, baseNode, extentNode, focusNode];

        const isSelectionInThisElement = selectionNodes.every(node => thisEl.contains(node));
        console.log(isSelectionInThisElement)
        // console.log(document.getSelection());
        if (isSelectionInThisElement) {
            console.log(selection.toString())
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
