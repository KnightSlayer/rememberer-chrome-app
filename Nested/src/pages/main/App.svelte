<script>
	import C from './Nested.svelte'
	import PhrasesLit from './PhrasesLit.svelte';
	import NewPhraseForm from './NewPhraseForm.svelte';
	let name = 'world';
</script>

<h1>Hello {name}!</h1>
<C/>


<NewPhraseForm/>
<PhrasesLit/>
