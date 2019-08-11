<script>
    // hsl ([0-360], 99, 69)
    export let text;
    export let selections;
    export let currentSelections;
    export let onSelect;

    let thisEl;

    const state = {
      from: null,
      length: null,
    };

    const selectionHandler = () => {
        state.from = state.length = null;

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
            state.from = startPos;
            state.length = finishPos - startPos;
        }
    };

    const onFocus = () => document.addEventListener('selectionchange', selectionHandler);
    const onBlur = () => document.removeEventListener('selectionchange', selectionHandler);
    const onEnter = (e) => {
        if (e.key !== 'Enter') return;
        if (!state.from || !state.length) return;

        console.log('Select it');

        onSelect(state);
    }
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
     on:keydown={onEnter}
     class="item"
>
  { text }
</div>
