<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4" style="color: #31525B">商品詳情</h1>
        <p>商品 ID: {{ productId }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ProductView',
  data() {
    return {
      productId: this.$route.params.id
    }
  }
}
</script>