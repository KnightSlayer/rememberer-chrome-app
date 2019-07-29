<script>
  import Phrase from './Phrase.svelte';
  import {phrases} from 'stores/phrases'

  $: prhasesIds = Object.keys($phrases);

</script>

<style>
  .ul {
    margin: 0.5em auto 0 auto;
    padding: 0;

    max-width: 88em;
  }
</style>


<ul class="ul">
  {#each prhasesIds as phraseId}
    <Phrase phraseId={phraseId} phrase={$phrases[phraseId]}/>
  {/each}
</ul>
