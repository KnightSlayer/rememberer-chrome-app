<script>
  import {phrases} from 'stores/phrases'
  import PhraseTextField from './PhraseTextField.svelte'

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

  function onSelect(who, {from, length}) {
    console.log('onSelect', who, {from, length});
    state.currentSelections[who] = {from, length};

    if (state.currentSelections.origin && state.currentSelections.translation) {
      console.log('Ura!')
    }
  }

  function onEsc(e) {
    if (e.key !== 'Escape') return;

    state.currentSelections = {
      origin: null,
      translation: null,
    };
  }

  function deletePhrase() {
    phrases.delete(phraseId);
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

<li class="phrase" on:keydown={onEsc}>
  <PhraseTextField text={phrase.origin}
                   highlights={phrase.highlights}
                   currentSelections={state.currentSelections.origin}
                   selections={null}
                   onSelect={(p) => onSelect('origin', p)}
  />

  <PhraseTextField text={phrase.transaction}
                   highlights={phrase.highlights}
                   currentSelections={state.currentSelections.translation}
                   selections={null}
                   onSelect={(p) => onSelect('translation', p)}
  />

  <div class="item youtube">
    <iframe class="{state.isVideoOpen ? '' : 'collapse'}" title="YouTube" src={phrase.youtubeLink}></iframe>
  </div>
  <div on:click={deletePhrase} class="item action"> Delete </div>
</li>
