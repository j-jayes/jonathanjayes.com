<script>
  export let data;
  let blogContainer; // Reference to the <div> element where the HTML is injected

</script>

<div bind:this={blogContainer}>
  {@html data.html}
</div>

<style>
  /* Add styles to ensure compatibility */
  div {
    padding: 20px;
  }
</style>
