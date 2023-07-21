<script lang="ts" setup>
const props = defineProps<{
    title: string,
    text: string,
    img: string
}>()
</script>

<template>
    <div class="image-text-section">
        <div class="container">
            <img
                alt=""
                src="@/assets/img/unistra.jpg"
            />
            <div>
                <h2>{{ props.title }}</h2>
                <p>{{ props.text }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.image-text-section {
  padding: 3rem 1rem;
  margin: 2rem 0;

  .container {
    display: flex;
    gap: 3rem;

    img {
      height: 15rem;
    }
  }
}

/* Changing the page's position to fit with the Accessibility Requirement */
@media screen and (min-width: 20rem) and (max-width: 26.875rem) {
  .container {
    display: flex;
    flex-direction: column;
  }
}

</style>
