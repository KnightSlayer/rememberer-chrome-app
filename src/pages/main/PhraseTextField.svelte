<script>
    export let text;
    export let selections;
    export let currentSelections;
    export let onSelect;
    export let highlights;

    let thisEl;

    const state = {
      from: null,
      length: null,
    };


    const TEXT_TYPE = {
      PLAIN: 'PLAIN',
      HIGHLIGHT:  'HIGHLIGHT',
    };
    const getPreviousSiblingsTextLength = (node) => {
        let res = 0;
        let prev = node.previousSibling;

        while (prev) {
            res += prev.textContent.length;
            prev = prev.previousSibling;
        }

        return res;
    };
    const getTextModel = (highlights, currentSelections, text) => {
        const allHighlights = [...highlights];

        if (currentSelections) {
            allHighlights.push(currentSelections);
            allHighlights.sort((a, b) => a.length - b.length);
        }

        const model = [];
        let i = 0;

        for (const hl of allHighlights) {
            if (hl.from > i) {
                const plainPart = text.slice(i, hl.from);
                model.push({
                    type: TEXT_TYPE.PLAIN,
                    text: plainPart,
                });

                i = hl.from;
            }

            model.push({
                type: TEXT_TYPE.HIGHLIGHT,
                text: text.slice(i, i + hl.length),
                color: hl.color,
            });

            i += hl.length;
        }

        if (i < text.length) {
            model.push({
                type: TEXT_TYPE.PLAIN,
                text: text.slice(i),
            });
        }
        return model;
    };

    $: textModel = getTextModel(highlights, currentSelections, text);

    const getTextHtml = (textModel) => {
        let html = '';

        for (const item of textModel) {
            switch (item.type) {
                case TEXT_TYPE.PLAIN: {
                    html += `<span>${item.text}</span>`;
                    break;
                }
                case TEXT_TYPE.HIGHLIGHT: {
                    html += `<span${item.color ? ' style="background: hsl(' + item.color + ', 69%, 69%)"' : ' class="currentSelection"'}>${item.text}</span>`;
                    break;
                }
            }
        }

        return html;
    };
    $: textHtml = getTextHtml(textModel);
    $: highlights1 = console.log(' NEW   highlights', text, highlights)

    const selectionHandler = () => {
        state.from = state.length = null;

        const selection = document.getSelection();
        const { anchorNode, focusNode, isCollapsed, anchorOffset, focusOffset } = selection;

        if (isCollapsed) return;

        const [startPos, finishPos] = anchorOffset > focusOffset ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset];

        const selectionNodes = [anchorNode, focusNode];

        const isSelectionInThisElement = selectionNodes.every(node => node.parentElement.parentElement === thisEl);

        if (isSelectionInThisElement && anchorNode === focusNode) {
            state.from = getPreviousSiblingsTextLength(anchorNode.parentElement) + startPos;
            state.length = finishPos - startPos;
        }
    };

    const onFocus = () => document.addEventListener('selectionchange', selectionHandler);
    const onBlur = () => document.removeEventListener('selectionchange', selectionHandler);
    const onEnter = (e) => {
        if (e.key !== 'Enter') return;
        if (state.from === null || !state.length) return;

        onSelect(state);
    }
</script>

<style>
    :global(.currentSelection) {
        /*background: hsl(150, 69%, 69%);*/
        animation: 1.4s ease-in blink infinite;
    }

    @keyframes blink {
        from { background: hsl(200, 69%, 69%); }
        50% { background: hsl(200, 69%, 89%); }
        to { background: hsl(200, 69%, 69%); }
    }
    .item {
        border: 1px solid #333;
        border-radius: 3px;
        padding: 0.5em;
        white-space: pre-wrap;

        flex: 1 1;
    }
    .item + .item {
        margin-left: 1em;
    }
    /*.currentSelection {*/
    /*    !*display: inline-block;*!*/
    /*    background: hsl(250, 69%, 69%);*/
    /*}*/
</style>

<div bind:this="{thisEl}"
     tabindex="0"
     on:focus={onFocus}
     on:blur={onBlur}
     on:keydown={onEnter}
     class="item"
>
    {@html textHtml}
<!--    {#each textModel as piece}-->
<!--        {#if piece.type === TEXT_TYPE.PLAIN}-->
<!--            { piece.text }-->
<!--        {/if}-->
<!--        {#if piece.type === TEXT_TYPE.HIGHLIGHT}-->
<!--            <span class="currentSelection"> { piece.text } </span>-->
<!--        {/if}-->
<!--    {/each}-->
</div>
