<script>
  const newItemForm = {
    origin: '',
    transaction: '',
    youtubeLink: '',
  };

  function onAdd() {

  }
</script>

<style>

</style>

<form on:submit|preventDefault={onAdd}>
  <label>
    Origin:
    <textarea bind:value={newItemForm.origin}/>
  </label>
  <label>
    Translation:
    <textarea bind:value={newItemForm.transaction}></textarea>
  </label>
  <label>
    Youtube Time Link:
    <input bind:value={newItemForm.youtubeLink}>
  </label>

  <button> Add new phrase </button>
</form>
