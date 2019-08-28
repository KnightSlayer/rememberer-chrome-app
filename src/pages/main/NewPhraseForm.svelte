<script>
  import phrases, { getBlankPhrase } from 'stores/phrases'
  import { analyzeLink } from 'services/youtube'

  // https://youtu.be/7_e0CA_nhaE?t=195

  const state = {
      newItemForm: getBlankPhrase(),
      isLoadingCaption: false,
      videoLink: 'https://youtu.be/7_e0CA_nhaE?t=195',
  };


  function onAdd() {
    phrases.add(state.newItemForm);

    state.newItemForm.origin = state.newItemForm.translation = state.newItemForm.youtubeLink = '';
  }
  function handleLink() {
    state.isLoadingCaption = true;

    analyzeLink(state.videoLink)
      .then(videoData => {
          state.isLoadingCaption = false;
          console.log('videoData', videoData)
      })
      .catch(() => {
          state.isLoadingCaption = false;
      })
  }

</script>

<style>

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
  <form on:submit|preventDefault={onAdd}>
    <label>
      Origin:
      <textarea bind:value={state.newItemForm.origin}></textarea>
    </label>
    <label>
      Translation:
      <textarea bind:value={state.newItemForm.translation}></textarea>
    </label>

    <button> Add new phrase </button>
  </form>
{/if}
