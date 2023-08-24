<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a
            class="breadcrumbs__link"
            href="index.html"
          >
            <router-link :to="{name:'main'}"> Каталог </router-link>
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ $store.getters.itemsCount }} товаров
        </span>
      </div>
    </div>

    <section class="cart">
      <div v-if="$store.getters.itemsCount === 0">
        В корзине пусто. Для перехода к оформлению заказа необходимо добавить товар в корзину
      </div>

      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit="sendForm"
      >
        <BasketList />

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ $store.getters.culculateTotalPrice }}₽</span>
          </p>  

          <RouterLink :to="{name:'order'}">
            <button              
              class="cart__button button button--primery"
              type="submit"
              :disabled="$store.getters.itemsCount === 0"
            >
              Оформить заказ
            </button>
          </RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BasketList from "@/components/Basket/BasketList.vue";

export default {
  components: {
    BasketList
  },
  data() {
    return {};
  },
  methods: {
    sendForm: function(e) {
      e.preventDefault();
    }
  },
  
}
</script>