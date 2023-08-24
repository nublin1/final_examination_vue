<template>  
  <RouterLink :to="`/item/${productInfo.id}`" class="catalog__pic">
    <ProductsGallery
      :colors="productColorsWithGallary"
      :chooset-color-obj="currentColorID"
      :item-id="productInfo.id"
    />
  </RouterLink>

  <h3 class="catalog__title">
    <a href="#">
      {{ productInfo.title }}
    </a>
  </h3>

  <span class="catalog__price">
    {{ $filters.priceFormat(productInfo.price) }} ₽
  </span>

  <colors-component
    :colors="productColors"
    :product-id-raw="productInfo.id"
    @update-color="handleColorChange" 
  />
</template>

<script>
import colorsComponent from '@/components/products/ProductsColors.vue';
import ProductsGallery from '@/components/products/ProductsGallery.vue';
import API_BASE_URL from '@/config';
const axios = require('axios').default;

export default {
  components: {
    colorsComponent,
    ProductsGallery
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    },
  },
  data() {
    return {   
      currentColorID: {},
    }
  },
  computed: {
    productInfo() {
      return this.product ? this.product : {};
    },
    productColors() {
      let colors = [];
      const data = this.productInfo;

      if (data && Array.isArray(data.colors)) {
        for (let i = 0; i < data.colors.length; i++) {
          const color = data.colors[i].color;
          colors.push(color);
        }
      }

      return colors;
    },
    productColorsWithGallary() {
      let colors = [];
      const data = this.productInfo;

      if (data && Array.isArray(data.colors)) {
        for (let i = 0; i < data.colors.length; i++) {
          const color = data.colors[i];
          colors.push(color);
        }
      }
      //console.log(colors);
      return colors;
    }
  },
  created() {
   
  },
  methods: {
    handleColorChange(colorId) {
      this.currentColorID = colorId;
    }
  }
}

</script>
