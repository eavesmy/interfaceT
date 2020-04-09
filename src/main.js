import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: "模拟接口调用",
	}
});

export default app;
