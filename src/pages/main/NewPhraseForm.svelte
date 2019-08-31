<script>
  import phrases, { getBlankPhrase } from 'stores/phrases'
  import { analyzeLink } from 'services/youtube'

  // https://youtu.be/7_e0CA_nhaE?t=195

  const state = {
      newItemForm: getBlankPhrase(),
      isLoadingCaption: false,
      videoLink: 'https://youtu.be/JyECrGp-Sw8?t=250', // канал - Ok
      // videoLink: 'https://youtu.be/98TQv5IAtY8?t=222', // Не работает. 403. TED-ed канал не дает доступа к субтитрам
      // videoLink: 'https://youtu.be/qhbuKbxJsk8?t=32', канал - Ok
      // videoLink: 'https://youtu.be/kkmmDJD7QAE?t=32', канал - Ok
  };


  function onAdd() {
    phrases.add(state.newItemForm);

    state.newItemForm = getBlankPhrase();
    state.videoLink = '';
  }
  function handleLink() {
    state.isLoadingCaption = true;

    analyzeLink(state.videoLink)
      .then(videoData => {
          state.isLoadingCaption = false;
          state.newItemForm = {
              ...state.newItemForm,
              ...videoData,
          };
          console.log('videoData', videoData)
      })
      .catch(() => {
          state.isLoadingCaption = false;
      })
  }

</script>

<style>
  .phraseForm {
    width: 80%;
    margin: auto;
  }
  .formRow {
    display: flex;
    justify-content: space-between;

  }
  .txtArea {
    width: 48%;
  }
  .txtArea > div {
    text-align: center;
  }
  .txtArea textarea {
    width: 100%;
    height: 5em;
  }
</style>


{#if !state.newItemForm.videoId}
  <form on:submit|preventDefault={handleLink}>
    <label>
      Youtube Time Link:
      <input bind:value={state.videoLink}>
    </label>
    <button> Get Video </button>
    {#if state.isLoadingCaption}
      Processing...
    {/if}
    </form>
{:else}
  <form on:submit|preventDefault={onAdd} class="phraseForm">
    <div class="formRow">
      <label class="txtArea">
        <div> Origin: </div>
        <textarea bind:value={state.newItemForm.origin}></textarea>
      </label>
      <label class="txtArea">
        <div> Translation: </div>
        <textarea bind:value={state.newItemForm.translation}></textarea>
      </label>
    </div>

    <div class="formRow">
      <label>
          Time
          <input type="number" bind:value={state.newItemForm.time}>
      </label>
      <label>
          Duration
          <input type="number" bind:value={state.newItemForm.duration}>
      </label>
      <button> Add new phrase </button>
    </div>
  </form>
{/if}
