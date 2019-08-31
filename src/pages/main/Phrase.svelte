<script>
  import phrases, {sortHighlights} from 'stores/phrases'
  import PhraseTextField from './PhraseTextField.svelte'
  import { initVideo } from 'services/youtube/iframeController'

  export let phraseId;
  export let phrase;

  const MODES = {
    DORMANCY: 1,
    ORIGIN: 2,
    TRANSLATION: 3,
  };

  const state = {
    mode: MODES.DORMANCY,
    isVideoOpen: false,
    currentSelections: {
      origin: null,
      translation: null,
    },
  };

  let iframePlaceholder;
  $: sortedHighlights = sortHighlights(phrase.highlights);

  function onSelect(who, {from, length}) {
    state.currentSelections[who] = {from, length};

    if (state.currentSelections.origin && state.currentSelections.translation) {
      const color = Math.ceil(Math.random() * 60) * 6;

      phrases.addHighlight(phraseId, {
        origin: {...state.currentSelections.origin},
        translation: {...state.currentSelections.translation},
        color,
      });

      state.currentSelections.origin = state.currentSelections.translation = null;
    }
  }

  function onKeyDown(e) {
    switch (e.code) {
      case 'KeyZ': {
        if (e.ctrlKey && e.shiftKey) {
          phrases.forward(phraseId);
          break;
        }
        if (e.ctrlKey) {
          phrases.back(phraseId);
          break;
        }
      }
      case 'Escape': {
        state.currentSelections = {
          origin: null,
          translation: null,
        };
        break;
      }
    }
  }

  function deletePhrase() {
    phrases.delete(phraseId);
  }
  function playYoutube() {
    initVideo({placeholder: iframePlaceholder, videoId: phrase.videoId, time: phrase.time, duration: phrase.duration})
      .then(controller => controller.play());
  }
</script>

<style>
  .phrase {
    display: flex;
  }

  .item {
    border: 1px solid #333;
    border-radius: 3px;
    padding: 0.5em;

    flex: 1 1;
  }
  .item + .item {
    margin-left: 1em;
  }
  .phrase + .phrase {
    margin-top: 0.7em;
  }
  .youtube {
    flex-grow: 0;
    cursor: pointer;
  }
  .collapse {
    max-height: 3em;
    max-width: 5em;
  }
  .action {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
</style>

<li class="phrase" on:keydown={onKeyDown}>
  <PhraseTextField text={phrase.origin}
                   highlights={sortedHighlights.origin}
                   currentSelections={state.currentSelections.origin}
                   selections={null}
                   onSelect={(p) => onSelect('origin', p)}
  />

  <PhraseTextField text={phrase.translation}
                   highlights={sortedHighlights.translation}
                   currentSelections={state.currentSelections.translation}
                   selections={null}
                   onSelect={(p) => onSelect('translation', p)}
  />

  <div on:click={playYoutube} class="item youtube">
    <div bind:this="{iframePlaceholder}"> Play </div>
  </div>
  <div on:click={deletePhrase} class="item action"> Delete </div>
</li>
