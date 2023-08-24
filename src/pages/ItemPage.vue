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
          <a class="breadcrumbs__link" href="#">
            <RouterLink :to="{name:'main', query:{categorySelectedId: Number(itemInfoData.category?.id)}}"> {{ itemInfo.category?.title }} </RouterLink>
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ itemInfo.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div v-if="!itemInfoIsLoaded" class="item__loading">
        <fulfilling-bouncing-circle-spinner
          :animation-duration="2000"
          :size="50"
          :color="'#e02d71'"
        />
        <br>
        Товар загружается...
      </div>

      <ProductGallery v-if="itemInfoIsLoaded" :color="itemInfo.colors" :selectedColorId="currentColorId" @update-color="updateColor" />

      <div class="item__info">
        <span class="item__code">Артикул: 150030</span>
        <h2 class="item__title">
          {{ itemInfo.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="decreaseNumberOfItems">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus" />
                  </svg>
                </button>

                <input
                  v-model="numberOfItems"
                  type="text"
                  
                  name="count"
                  @change="numberOfItemsIsPositive(numberOfItems)"
                >

                <button type="button" aria-label="Добавить один товар" @click.prevent="increaseNumberOfItems">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus" />
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ totalPrice }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li
                    v-for="(color) in itemInfo.colors"
                    :key="'color'+color.id"
                    class="colors__item"
                  >
                    <label class="colors__label">
                      <input
                        :id="'productColorInput' + color.id"
                        v-model="selectedColorId"
                        class="colors__radio sr-only"
                        type="radio"
                        :name="'color-item' + color.id"
                        :value="color.id"
                        :checked="color.id === currentColorId"
                      >
                      <span 
                        class="colors__value" :style="{ 'background-color': color.color.code }" />
                    </label>
                  </li>                  
                </ul>
              </fieldset>


              <fieldset class="form__block">                
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select
                    v-model="currentSizeId"
                    class="form__select"
                    name="category"
                  >
                    <option v-for="(item, index) in itemInfo.sizes"
                            :key="'size'+index"
                            :value="item.id"
                            :selected="item.id === currentSizeId"
                    > {{ item.title }}
                    </option>
                    
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit" @click.prevent="addItemToBusket($event.target)">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" v-for="(tab, n) in tabs" :key="n">
            <button
              :class="['tabs__link', { 'tabs__link--current': tab.name === currentTab }]"
              @click="currentTab = tab.name"
            >
              {{ tab.title }}
            </button>
          </li>
        </ul>

        <div class="item__content">
          <keep-alive>
            <component :is="currentTabComponent" :content="itemInfo.content" />
          </keep-alive>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import ProductGallery from '@/components/product/ProductGallery.vue';
import ProductTabInfo from "@/components/product/ProductTabInfo.vue";
import ProductTabDelivery from "@/components/product/ProductTabDelivery.vue";

import { FulfillingBouncingCircleSpinner } from "epic-spinners";

import API_BASE_URL from '@/config';
import { RouterLink } from 'vue-router';

const axios = require('axios').default;

export default {
  components: {
    ProductGallery,
    ProductTabInfo,
    ProductTabDelivery,
    FulfillingBouncingCircleSpinner,
    RouterLink
},
  data() {
    return {
      itemInfoData : {},
      itemInfoIsLoaded: false,
      itemInfoError: false,

      numberOfItems: 1,
      selectedColorId: null,
      selectedSizeId: null,

      currentTab: "Info",
      tabs: [
        { name: "Info", title: "Информация о товаре" },
        { name: "Delivery", title: "Доставка и возврат" },
      ],
    }
  },
  computed: {
    itemInfo: {
      get() {
        return this.itemInfoData ? this.itemInfoData : {};
      }
    },
    currentColorId: {
      get() {
        return this.selectedColorId? this.selectedColorId :this.itemInfoData.colors[0].id;        
      },
      set(value) {
        this.selectedColorId = value;
      }    
    },
    currentSizeId: {
      get() {
        if (this.selectedSizeId) {
          return this.selectedSizeId;
        }
        const data = this.itemInfo;
        if (data &&  data.sizes && data.sizes.length > 0) {          
          return data.sizes[0].id;
        }
        return null;
       
      },
      set(value) {
        this.selectedSizeId = value;
      }
    },
    totalPrice() {
      return this.$filters.priceFormat(this.itemInfoData.price * this.numberOfItems);
    },
    currentTabComponent() {
      return `ProductTab${this.currentTab}`;
    },
  },
  created() {
    this.getItemInfo();
  },
  methods: {
    getItemInfo() {
      this.itemInfoIsLoaded = false;
      this.itemInfoError = false;

      clearTimeout(this.itemInfoTimer);
      this.itemInfoTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/products/${this.$route.params.id}`)
        .then((response) => {
          this.itemInfoData = response.data;
          this.itemInfoIsLoaded = true;
          this.itemInfoError = false;

          // Устанавливаем selectedSizeId в id первого размера, если sizes не пуст
          if (this.itemInfoData.sizes && this.itemInfoData.sizes.length > 0) {
            this.selectedSizeId = this.itemInfoData.sizes[0].id;
          }
          if (this.itemInfoData.colors && this.itemInfoData.colors.length > 0) {
            this.selectedColorId = this.itemInfoData.colors[0].id;
          }

        })
        .catch(() => {
          this.itemInfoIsLoaded = false;
          this.itemInfoError = true;
        })
      }, 0);      
    },

    increaseNumberOfItems() {
      this.numberOfItems++;
    },
    decreaseNumberOfItems() {
      if (this.numberOfItems > 1)
        this.numberOfItems--;
    },
    numberOfItemsIsPositive(value) {
      if (isNaN(value) || value < 1) {
        this.numberOfItems = 1;
      }
    },
    updateColor(value) {      
      this.currentColorId = value;
    },

    addItemToBusket(target) {    
      const colorObj = this.itemInfo.colors.find(item => item.id === this.currentColorId);      
      
      axios.post(`${API_BASE_URL}api/baskets/products`, {
        productId: this.$route.params.id,
          colorId: String( colorObj.color.id),
          sizeId : String(this.selectedSizeId),
          quantity: String(this.numberOfItems),
      }, {
        params: {
          userAccessKey : this.$store.state.accessKey,         
        },      
      })
      .then((response) => {
        //console.log(response.data);
        this.$store.commit('updateBasket', response.data);
        target.textContent = "Добавлено";
        setTimeout(() => {
          target.textContent = "В корзину";
        }, 2000);
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.item__loading {
  text-align: center;
  .fulfilling-bouncing-circle-spinner{
    display: inline-block;
  }
}
</style>