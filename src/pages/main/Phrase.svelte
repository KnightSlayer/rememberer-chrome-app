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
  };


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

<li class="phrase">
  <PhraseTextField text={phrase.origin} highlights={phrase.highlights}/>

  <PhraseTextField text={phrase.transaction} highlights={phrase.highlights}/>

  <iframe class="item {state.isVideoOpen ? '' : 'collapse'}" title="YouTube" src={phrase.youtubeLink}></iframe>
  <div on:click={deletePhrase} class="item action"> Delete </div>
</li>
