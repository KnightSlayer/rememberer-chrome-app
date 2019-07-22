<script>
  export let phraseId;
  export let phrase;

  let isVideoOpen = false;

  function deletePhrase() {
    console.log('delete', phraseId)
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
  <div class="item"> {phrase.origin} </div>
  <div class="item"> {phrase.transaction} </div>
  <iframe class="item {isVideoOpen ? '' : 'collapse'}" title="YouTube" src={phrase.youtubeLink}></iframe>
  <div on:click={deletePhrase} class="item action"> Delete </div>
</li>
