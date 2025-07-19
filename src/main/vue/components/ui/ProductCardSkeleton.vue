<template>
  <v-card class="product-card-skeleton" elevation="2">
    <v-skeleton-loader
      type="image"
      height="200"
      class="skeleton-image"
    ></v-skeleton-loader>
    
    <v-card-text class="pb-2">
      <v-skeleton-loader
        type="heading"
        class="mb-2"
      ></v-skeleton-loader>
      
      <div class="d-flex align-center mb-2">
        <v-skeleton-loader
          type="text"
          width="80"
          class="mr-2"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="text"
          width="40"
        ></v-skeleton-loader>
      </div>
    </v-card-text>
    
    <v-card-actions class="pt-0">
      <div class="d-flex align-center justify-space-between w-100">
        <div>
          <v-skeleton-loader
            type="text"
            width="80"
            class="mb-1"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            width="60"
          ></v-skeleton-loader>
        </div>
        
        <v-skeleton-loader
          type="avatar"
          width="32"
          height="32"
        ></v-skeleton-loader>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ProductCardSkeleton'
}
</script>

<style scoped>
.product-card-skeleton {
  height: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-image {
  border-radius: 4px 4px 0 0;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.product-card-skeleton :deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg, #f0f0f0 25%, rgba(255, 255, 255, 0.5) 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.theme--dark .product-card-skeleton :deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg, #2a2a2a 25%, rgba(255, 255, 255, 0.1) 50%, #2a2a2a 75%);
  background-size: 200% 100%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>