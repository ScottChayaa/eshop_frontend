<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4" style="color: #31525B">商品分類</h1>
        <p>分類 ID: {{ categoryId }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CategoryView',
  data() {
    return {
      categoryId: this.$route.params.id
    }
  }
}
</script>