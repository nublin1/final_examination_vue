<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a
            class="breadcrumbs__link"
            href="index.html"
          >
            <RouterLink :to="{ name: 'main' }"> Каталог </RouterLink>
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a
            class="breadcrumbs__link"
            href="cart.html"
          >
            <RouterLink :to="{ name: 'basket1' }"> Корзина </RouterLink>
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit="checkForm"
      >
        <div class="cart__field">
          <div class="cart__data">
            <label class="form__label">
              <input
                v-model="fullName"
                class="form__input"
                type="text"
                name="name"
                placeholder="Введите ваше полное имя"
              >
              <span class="form__value">ФИО</span>
              <span
                v-if="fullNameError.length > 0"
                class="form__error"
              >{{ fullNameError }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="address"
                class="form__input"
                type="text"
                name="address"
                placeholder="Введите ваш адрес"
              >
              <span class="form__value">Адрес доставки</span>
              <span
                v-if="adressError.length > 0"
                class="form__error"
              >{{ adressError }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="phone"
                class="form__input"
                type="tel"
                name="phone"
                placeholder="Введите ваш телефон"
              >
              <span class="form__value">Телефон</span>
              <span
                v-if="phoneError && phoneError.length > 0"
                class="form__error"
              >{{ phoneError }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="email"
                class="form__input"
                type="email"
                name="email"
                placeholder="Введи ваш Email"
              >
              <span class="form__value">Email</span>
              <span
                v-if="emailError.length > 0"
                class="form__error"
              >{{ emailError }}</span>
            </label>

            <label class="form__label">
              <textarea
                v-model="comments"
                class="form__input form__input--area"
                name="comments"
                placeholder="Ваши пожелания"
              />
              <span class="form__value">Комментарий к заказу</span>
            </label>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">
              Доставка
            </h3>
            <ul class="cart__options options">
              <li
                v-for="(delivery, index) in deliveries"
                :key="'delivery' + index"
                class="options__item"
              >
                <label class="options__label">
                  <input
                    v-model="deliveryChoose"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="delivery.id"
                    :checked="delivery.id === deliveryChoose"
                  >
                  <span class="options__value">
                    {{ delivery.title }} <b>{{ delivery.price }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">
              Оплата
            </h3>
            <ul class="cart__options options">
              <li
                v-for="(payment, index) in paymentTypes"
                :key="'payment' + index"
                class="options__item"
              >
                <label class="options__label">
                  <input
                    v-model="paymentTypeChooseId"
                    class="options__radio sr-only"
                    type="radio"
                    name="paymant"
                    :value="payment.id"
                    :checked="payment.id === paymentTypeChooseId"
                  >
                  <span class="options__value">
                    {{ payment.title }} при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <OrderList />

          <div class="cart__total">
            <p>Доставка: <b>{{ deliveryPrice == 0 ? 'Бесплатно' : deliveryPrice }}</b></p>
            <p>
              Итого: <b>{{ $store.getters.itemsCount }}</b> товара на сумму <b>{{
                $filters.priceFormat($store.getters.culculateTotalPrice) }} ₽</b>
            </p>
          </div>

          <button
            class="cart__button button button--primery"
            type="submit"
          >
            Оформить заказ
          </button>
        </div>
        <!-- <div class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div> -->
      </form>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import OrderList from '../components/Orders/OrderList.vue'

import API_BASE_URL from '@/config.js'

export default {
  name: 'OrderStep',
  components: {
    OrderList,
  },
  setup() {
    return {};
  },
  data() {
    return {
      fullName: '',
      address: '',
      phone: '',
      email: '',
      comments: '',

      fullNameError: '',
      adressError: '',
      phoneError: '',
      emailError: '',



      paymentTypes: [],
      paymentTypeChooseId: 1,

      deliveries: [],
      deliveryChoose: null,
      deliveryPrice: 0,
    }
  },

  watch: {
    deliveryChoose: function () {
      if (this.deliveryChoose) {
        this.loadPaymentTypes();
        this.deliveryPrice = this.deliveries.find((item) => item.id === this.deliveryChoose).price;
      }
    },
  },
  created() {
    this.loadDeliveries();
    //this.loadPaymentTypes();
  },
  methods: {
    loadDeliveries() {
      axios.get(`${API_BASE_URL}api/deliveries`)
        .then((response) => {
          this.deliveries = response.data;
          this.deliveryChoose = response.data[0].id;
        })
        .catch((error) => {
          console.log(error);
        })
    },

    loadPaymentTypes() {
      axios.get(`${API_BASE_URL}api/payments`, {
        params: {
          deliveryTypeId: this.deliveryChoose
        }
      })
        .then((response) => {
          this.paymentTypes = response.data;
          this.paymentTypeChooseId = response.data[0].id;
        })
        .catch((error) => {
          console.log(error);
        })
    },

    checkForm: function (e) {
      e.preventDefault();

      this.fullNameError = '';
      this.adressError = '';
      this.phoneError = '';
      this.emailError = '';

      if (!this.fullName) {
        this.fullNameError = 'Укажите ваше ФИО';
      }

      if (!this.address) {
        this.adressError = 'Укажите адрес доставки';
      }

      if (!this.phone) {
        this.phoneError = 'Укажите телефон для связи';
      }
      else {
        this.phoneError = this.validNumber(this.phone);
      }

      if (!this.email) {
        this.emailError = 'Укажите почту';
      }
      else if (!this.validEmail(this.email)) {
        this.emailError = 'Неверный формат почты';
      }



      if (!this.fullNameError && !this.adressError && !this.phoneError && !this.emailError) {
        this.postOrder();
      }
    },
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validNumber(number) {
      if (isNaN(number)) {
        return "Разрешены только цифры";
      }
      if (number.length < 11) {
        return "Телефон должен быть не менее 11 символов";
      }
    },

    postOrder() {
      axios.post(`${API_BASE_URL}api/orders`, {
        name: this.fullName,
        address: this.address,
        phone: this.phone,
        email: this.email,
        comments: this.comments,
        deliveryTypeId: this.deliveryChoose,
        paymentTypeId: this.paymentTypeChooseId
      }, {
        params: {
          userAccessKey: this.$store.state.accessKey,
        }
      })
        .then((response) => {
          localStorage.setItem('orderInfo', JSON.stringify(response.data));
          this.$store.commit('updateOrderInfo', response.data);
          this.$store.commit('updateBasket', []);
          this.$router.push({ name: 'order-success' });
          //console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>