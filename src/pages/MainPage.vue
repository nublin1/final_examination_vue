<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ paginationData.total }} товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter :category-id="categorySelectedId" @updateFilter="updateFilterSync" />

      <section class="catalog">
        <div v-if="products.length === 0" class="catalog__loading">
          <AtomSpinner :animation-duration="1000" :size="60" color="#ff1d5e" />
          <br>
          Товары загружаются...
        </div>

        <ProductList :products="products" />

        <Pagination :pagination-data="paginationData"
                    @update:page="updateCurrentPage"
        />
      </section>
    </div>
  </main>  
</template>

<script>
import ProductFilter from '@/components/products/ProductsFilter.vue';
import ProductList from '@/components/ProductList.vue';
import Pagination from '@/components/Base/PaginationComp.vue';

import { AtomSpinner } from 'epic-spinners'

import API_BASE_URL from '@/config';
const axios = require('axios').default;

export default {
  components: {
    ProductFilter,
    ProductList,
    Pagination,
    AtomSpinner,
  },
  data() {
    return {
      currentPage: 1,
      limitPerPage: 12,
      categorySelectedId: 0,
      materialsSelected: [],
      colorsSelected: [],
      seasonsSelected: [],
      priceFrom: 0,
      priceTo: 0,

      productsData: null,
      prodoctsLoading: false,
      prodoctsLoadingError: false,
    }
  },
  computed: {
    products() {    
      return this.productsData ? this.productsData.items : [];
    },
    paginationData() {
      return this.productsData ? this.productsData.pagination : {};
    }
  },
  watch: {
    currentPage() {
      this.loadProducts();
    },
    
  },
  created() {
    this.categorySelectedId = Number(this.$route.query.categorySelectedId) || 0;
    this.loadProducts();
  },

  methods: {
    updateFilterSync(priceFrom, priceTo, categorySelected, colorsSelected, materialsSelected, seasonsSelected, page) {
      //console.log(priceFrom, priceTo, categorySelected, colorsSelected, materialsSelected, seasonsSelected, page);
      this.categorySelectedId = categorySelected;
      this.materialsSelected = materialsSelected;
      this.colorsSelected = colorsSelected;
      this.seasonsSelected = seasonsSelected;
      this.priceFrom = priceFrom;
      this.priceTo = priceTo;
      this.currentPage = page;

      this.loadProducts();
    },
    updateCurrentPage(page) {
      this.currentPage = page;
    },

    loadProducts() {
      this.prodoctsLoading = true;
      this.prodoctsLoadingError = false;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/products`, {
          params: {
            "categoryId": this.categorySelectedId,
            "materialIds": this.materialsSelected,
            "colorIds": this.colorsSelected,
            "seasonIds": this.seasonsSelected,
            "page": this.currentPage,
            "limit": this.limitPerPage,
            "minPrice": this.priceFrom,
            "maxPrice": this.priceTo,
          }
        })
          .then((response) => {
            this.productsData = response.data;
            this.prodoctsLoading = false;
            this.prodoctsLoadingError = false;

          })
          .catch((error) => {
            this.prodoctsLoading = false;
            this.prodoctsLoadingError = true;
          })
      }, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog__loading {
  text-align: center;
  .atom-spinner {
    display: inline-block;
  }
}
</style>