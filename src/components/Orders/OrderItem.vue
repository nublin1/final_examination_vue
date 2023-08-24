<template>
  <h3>{{ item.product.title }}</h3>
  <b>{{ $filters.priceFormat(item.product.price * item.quantity)}} ₽</b>
  <span>Артикул: 150030</span>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,

    }
  }
};
</script>