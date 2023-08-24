<template>
  <div class="product__pic">
    <img :src="item.color.gallery ? item.color.gallery[0].file.url : '/img/not-img.webp'" width="120" height="120"
      :srcset="item.color.gallery ? item.color.gallery[0].file.url : '/img/not-img.webp'" alt="Название товара">
  </div>
  <h3 class="product__title">
    {{ item.product.title }}
  </h3>
  <p class="product__info product__info--color">
    Цвет:
    <span>
      <i :style="{ 'background-color': item.color.color.code }" />
      {{ item.color.color.title }}
    </span>
  </p>
  <span class="product__code">
    Артикул: 1501230
  </span>

  <div class="product__counter form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="decreaseQuantity(item)">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus" />
      </svg>
    </button>

    <input v-model="itemQunt" type="text" name="count" @change.prevent="numberOfItemsIsPositive(item)">

    <button type="button" aria-label="Добавить один товар" @click.prevent="increaseQuantity(item)">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus" />
      </svg>
    </button>
  </div>

  <b class="product__price">
    {{ $filters.priceFormat(item.product.price * itemQunt) }} ₽
  </b>

  <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
    @click.prevent="$store.dispatch('deleteFromBasket', item.id)">
    <svg width="20" height="20" fill="currentColor">
      <use xlink:href="#icon-close" />
    </svg>
  </button>
</template>

<script>
import API_BASE_URL from '@/config';
const axios = require('axios').default;

export default {
  props: {
    item: {
      type: Object,
      required: true,
      default: () => { },
    }
  },
  data() {
    return {
      itemQunt: 1,
    };
  },
  created() {
    this.itemQunt = this.item.quantity;
  },

  methods: {
    increaseQuantity(item) {
      item.quantity++;
      this.itemQunt++;
      this.updateItemQuantity();
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.itemQunt--;
        this.updateItemQuantity();
      }
    },
    numberOfItemsIsPositive(item) {
      if (isNaN(item.quantity) || item.quantity < 1) {
        return 1;
      }
      this.changeItemQuantity(item);
      return item.quantity;
    },
    changeItemQuantity(item) {      
      axios.put(`${API_BASE_URL}api/baskets/products`, {
        basketItemId: item.id,
        quantity: this.itemQunt,
      }, {
        params: {
          userAccessKey: this.$store.state.accessKey,
        },
      })
        .then((response) => {
          this.$store.commit('updateBasket', response.data);
        })
        .catch((error) => {
          console.log(error);
        })
    },

    updateItemQuantity() {
    axios.put(`${API_BASE_URL}api/baskets/products`, {
      basketItemId: this.item.id,
      quantity: this.item.quantity,
    }, {
      params: {
        userAccessKey: this.$store.state.accessKey,
      },
    })
      .then((response) => {
        this.$store.commit('updateBasket', response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  },
  },
  
}

</script>