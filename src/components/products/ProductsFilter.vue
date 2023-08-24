<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="submitFilter">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" :value="priceFrom" @input="priceFrom = $event.target.value">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" :value="priceTo" @input="priceTo = $event.target.value">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select v-model="categorySelected" class="form__select" name="category">
            <option value="0">Все категории</option>
            <option v-for="category in categoriesList.items" :key="category.id" :value="category.id"> {{ category.title
            }} </option>

          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list" id="v-model-multiple-checkboxes">
          <li v-for="material in materialsList.items" :key="material.id" class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="material"
                :id="'filterInputMaterial' + material.id" :value="material.id" v-model="materialsSelected" />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="season in seasonsList.items" :key="season.id">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="collection"
                :id="'filterInputCollection' + season.id" :value=season.id v-model="seasonsSelected" checked="">
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click="resetFilter">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import API_BASE_URL from '@/config';

const axios = require('axios').default;

export default {
  props: {
    categoryId: {
      type: Number,
      required: true,
      default: 0,
    }
  },
emits: ['updateFilter'],
  data() {
    return {   
      priceFrom: 0,
      priceTo: 0,

      categories: null,
      categoriesLoading: false,
      categoriesLoadingError: false,
      categorySelected: 0,

      colors: null,
      colorsLoading: false,
      colorsLoadingError: false,
      colorsSelected: [],

      materials: null,
      materialsLoading: false,
      materialsLoadingError: false,
      materialsSelected: [],

      seasons: null,
      seasonsLoading: false,
      seasonsLoadingError: false,
      seasonsSelected: [],      
    }
  },

  computed: {
    categoriesList() {
      return this.categories? this.categories : [];
    },
    materialsList() {
      return this.materials? this.materials : [];
    },
    seasonsList() {
      return this.seasons? this.seasons : [];
    }
  },
  watch: {
    categoryId: {
      handler() {
        this.categorySelected = this.categoryId;
      },
      immediate: true,
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },

  methods: {
    loadCategories() {
      this.categoriesLoading = true;
      this.categoriesLoadingError = false;

      clearTimeout(this.loadCategoriesTimer);
      this.loadCategoriesTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/productCategories`)
        .then((response) => {
          this.categories = response.data;          
          this.categoriesLoading = false;
        })
        .catch(() => {
          this.categoriesLoading = false;
          this.categoriesLoadingError = true;
        })
      }, 0);
    },

    loadColors() {
      this.colorsLoading = true;
      this.colorsLoadingError = false;

      clearTimeout(this.loadColorsTimer);
      this.loadColorsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/colors`)
        .then((response) => {
          this.colors = response.data;          
          this.colorsLoading = false;
        })
        .catch(() => {
          this.colorsLoading = false;
          this.colorsLoadingError = true;
        })
      }, 0);
    },

    loadMaterials() {
      this.materialsLoading = true;
      this.materialsLoadingError = false;

      clearTimeout(this.loadMaterialsTimer);
      this.loadMaterialsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/materials`)
        .then((response) => {
          this.materials = response.data;
          this.materialsLoading = false;          
        })
        .catch(() => {
          this.materialsLoading = false;
          this.materialsLoadingError = true;
        })
      }, 0);
    },

    loadSeasons() {
      this.seasonsLoading = true;
      this.seasonsLoadingError = false;

      clearTimeout(this.loadSeasonsTimer);
      this.loadSeasonsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/seasons`)
        .then((response) => {
          this.seasons = response.data;
          this.seasonsLoading = false;          
        })
        .catch(() => {
          this.seasonsLoading = false;
          this.seasonsLoadingError = true;
        })
      }, 0);
    },  
    
    resetFilter() {
      this.priceFrom = 0;
      this.priceTo = 0;
      this.categorySelected = 0;
      this.colorsSelected = [];
      this.materialsSelected = [];
      this.seasonsSelected = [];
      this.$router.push({ name: 'main', query: {} });
      this.submitFilter();
    },

    submitFilter() {    
      this.$emit("updateFilter", this.priceFrom, this.priceTo, this.categorySelected,this.colorsSelected, this.materialsSelected, this.seasonsSelected, 1);
     
    },
  }
}
</script>