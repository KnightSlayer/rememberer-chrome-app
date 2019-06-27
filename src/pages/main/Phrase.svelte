<script>
  export let phraseId;
  export let phrase;
</script>


<li>
  <div> {phrase.origin} </div>
  <div> {phrase.transaction} </div>
  <iframe title="YouTube" src={phrase.youtubeLink}></iframe>
</li>
