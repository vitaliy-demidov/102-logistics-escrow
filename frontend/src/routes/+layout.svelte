<script>
  import '../app.css';
  let { children } = $props();
</script>

<main class="h-screen w-screen overflow-hidden bg-black text-white relative">
  {@render children()}
</main>
