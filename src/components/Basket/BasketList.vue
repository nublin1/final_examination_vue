<template>
  <div class="cart__field">
    <ul class="cart__list">
      <li v-for="(item) in $store.state.basket.items" :key="item.id" class="cart__item product">
        <BasketItem :item="item"/>
      </li>      
    </ul>
  </div>
</template>

<script>
import BasketItem from './BasketItem.vue';

export default {
  components: {
    BasketItem
  },
  data() {
    return {};
  },
  created() {
    
  },
  methods: {
    
  }
}
</script>