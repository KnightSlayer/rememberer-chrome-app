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


    const TEXT_TYPE = {
      PLAIN: 'PLAIN',
      HIGHLIGHT:  'HIGHLIGHT',
    };
    const getTextModel = (currentSelections, text) => {
        if (!currentSelections) {
            return [{
                type: TEXT_TYPE.PLAIN,
                text,
            }];
        }
        console.log('currentSelections', currentSelections)

        const model = [];
        let i = 0;

// for cycle start
        if (currentSelections.from > i) {
            const plainPart = text.slice(i, currentSelections.from);
            model.push({
                type: TEXT_TYPE.PLAIN,
                text: plainPart,
            });

            i += currentSelections.from;
        }

        model.push({
            type: TEXT_TYPE.HIGHLIGHT,
            text: text.slice(i, i + currentSelections.length),
        });

        i += currentSelections.length;
// for cycle end

        if (i < text.length) {
            model.push({
                type: TEXT_TYPE.PLAIN,
                text: text.slice(i),
            });
        }
        return model;
    };

    $: texetModel = getTextModel(currentSelections, text);

    const selectionHandler = () => {
        state.from = state.length = null;

        const selection = document.getSelection();
        const { anchorNode, focusNode, isCollapsed, anchorOffset, focusOffset } = selection;

        if (isCollapsed) return;

        const [startPos, finishPos] = anchorOffset > focusOffset ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset];

        const selectionNodes = [anchorNode, focusNode];

        const isSelectionInThisElement = selectionNodes.every(node => node.parentElement === thisEl);

        if (isSelectionInThisElement) {
            // console.log(selection, selection.toString());
            // console.log('start at ', startPos);
            // console.log('length is ', finishPos - startPos);
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
    .currentSelection {
        background: hsl(250, 69%, 69%);
    }
</style>

<div bind:this="{thisEl}"
     tabindex="0"
     on:focus={onFocus}
     on:blur={onBlur}
     on:keydown={onEnter}
     class="item"
>
    {#each texetModel as piece}
        {#if piece.type === TEXT_TYPE.PLAIN}
            { piece.text }
        {/if}
        {#if piece.type === TEXT_TYPE.HIGHLIGHT}
            <span class="currentSelection"> { piece.text } </span>
        {/if}
    {/each}
</div>
