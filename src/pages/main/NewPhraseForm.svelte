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
    analyzeLink(state.videoLink)
      .then(videoData => {
          console.log('videoData', videoData)
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
