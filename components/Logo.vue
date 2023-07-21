<template>
  <LazyHydrate never>
    <div>
      <img
        src="/images/horiz-tagline.png"
        max-width="503"
        width = "60%"
        max-height="100"
        alt="COMUNDA Tagline"
        srcset=""
      />
    </div>
  </LazyHydrate>
</template>

<script>
export default {
  components: {
    LazyHydrate: () => import('vue-lazy-hydration')
  }
}
</script>
