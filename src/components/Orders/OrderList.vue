<template>
  <ul class="cart__orders">
    <li v-for="item in $store.state.basket.items" :key="item.id" class="cart__order">
      <OrderItem :item="item" />
    </li>
  </ul>
</template>

<script>
import OrderItem from "@/components/Orders/OrderItem.vue";
export default {
  components: {
    OrderItem
  }
}
</script>