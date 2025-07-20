<template>
  <div class="product-image-gallery">
    <!-- 商品大圖顯示區域 -->
    <div class="main-image-container">
      <v-carousel
        v-model="selectedImageIndex"
        height="400"
        hide-delimiter-background
        show-arrows="hover"
        cycle
        :interval="false"
        class="main-carousel"
      >
        <v-carousel-item
          v-for="(image, index) in images"
          :key="index"
          :src="image.url"
          :alt="image.alt || `商品圖片 ${index + 1}`"
          cover
          class="main-image"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>
        </v-carousel-item>
      </v-carousel>
      
      <!-- 圖片指示器 (手機版) -->
      <div v-if="$vuetify.display.smAndDown" class="mobile-indicators">
        <span class="image-counter">
          {{ selectedImageIndex + 1 }} / {{ images.length }}
        </span>
      </div>
    </div>

    <!-- 商品小圖預覽區域 -->
    <div class="thumbnail-container" v-if="images.length > 1">
      <!-- PC版：垂直排列 -->
      <div v-if="$vuetify.display.mdAndUp" class="thumbnail-grid">
        <v-card
          v-for="(image, index) in images"
          :key="index"
          :class="['thumbnail-item', { 'active': index === selectedImageIndex }]"
          @click="selectImage(index)"
          elevation="2"
        >
          <v-img
            :src="image.url"
            :alt="image.alt || `預覽圖 ${index + 1}`"
            height="80"
            cover
          >
            <template v-slot:placeholder>
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </template>
          </v-img>
        </v-card>
      </div>

      <!-- 手機版：水平滑動 -->
      <div v-else class="thumbnail-slider">
        <v-sheet class="thumbnail-scroll-container">
          <div class="thumbnail-scroll">
            <v-card
              v-for="(image, index) in images"
              :key="index"
              :class="['thumbnail-item-mobile', { 'active': index === selectedImageIndex }]"
              @click="selectImage(index)"
              elevation="2"
            >
              <v-img
                :src="image.url"
                :alt="image.alt || `預覽圖 ${index + 1}`"
                height="60"
                width="60"
                cover
              >
                <template v-slot:placeholder>
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </template>
              </v-img>
            </v-card>
          </div>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ProductImageGallery',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  emits: ['image-change'],
  setup(props, { emit }) {
    const selectedImageIndex = ref(0)

    // 確保有預設圖片
    const images = computed(() => {
      if (!props.images || props.images.length === 0) {
        return [{
          url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=商品圖片',
          alt: '商品圖片'
        }]
      }
      return props.images
    })

    const selectImage = (index) => {
      if (index >= 0 && index < images.value.length) {
        selectedImageIndex.value = index
        emit('image-change', {
          index,
          image: images.value[index]
        })
      }
    }

    // 監聽圖片變化
    watch(selectedImageIndex, (newIndex) => {
      emit('image-change', {
        index: newIndex,
        image: images.value[newIndex]
      })
    })

    // 重置選中圖片當圖片陣列改變時
    watch(() => props.images, () => {
      selectedImageIndex.value = 0
    })

    return {
      selectedImageIndex,
      images,
      selectImage
    }
  }
}
</script>

<style scoped>
.product-image-gallery {
  width: 100%;
}

.main-image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.main-carousel {
  border-radius: 8px;
}

.main-image {
  background-color: #ffffff;
}

.mobile-indicators {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.thumbnail-container {
  margin-top: 16px;
}

/* PC版縮圖樣式 */
.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.thumbnail-item {
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.thumbnail-item.active {
  border-color: #FFA101;
  box-shadow: 0 0 0 1px #FFA101;
}

/* 手機版縮圖樣式 */
.thumbnail-slider {
  width: 100%;
}

.thumbnail-scroll-container {
  background: transparent;
  padding: 8px 0;
}

.thumbnail-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 4px;
  scroll-behavior: smooth;
}

.thumbnail-scroll::-webkit-scrollbar {
  height: 4px;
}

.thumbnail-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
  background: #FFA101;
  border-radius: 2px;
}

.thumbnail-item-mobile {
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.thumbnail-item-mobile.active {
  border-color: #FFA101;
  box-shadow: 0 0 0 1px #FFA101;
}

/* 確保圖片正確顯示 */
:deep(.v-img__img) {
  object-fit: cover;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .main-image-container {
    border-radius: 0;
  }
  
  .main-carousel {
    border-radius: 0;
  }
  
  .thumbnail-scroll {
    padding: 0 16px;
  }
}

@media (min-width: 960px) {
  .thumbnail-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .thumbnail-item {
    height: 100px;
  }
}
</style>