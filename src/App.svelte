<script>

    import {Router, Route} from 'svelte-routing';

    import Doc from './components/doc.svelte';
    import Home from './components/home.svelte';
    
    let url = "";
   
</script>

<Router url={url}>
    <Route path="/" component={Home}/>
    <Route path="/doc" component={Doc}/>
</Router>

<style>
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
