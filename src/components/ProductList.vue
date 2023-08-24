<template>
  <ul class="catalog__list">
    <li
      v-for="(product) in products"
      :key="product.id"
      class="catalog__item"
    >
      <ProductItem :product="product" />
    </li>
  </ul>
</template>

<script>
import ProductItem from './products/ProductItem.vue';

export default {
  components: {
    ProductItem,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      
    };
  },
  computed: {
   
  }

}
</script>