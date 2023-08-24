<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a 
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage === 1}"
        aria-label="Предыдущая страница"
        @click.prevent="prevPage"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li v-for="i in numberOfPages"
        :key="'page' + i"
        class="pagination__item"
    >
      <a 
        class="pagination__link"        
        href="#"
        :class="{'pagination__link--current': i === currentPage}"
        @click.prevent="gotoPage(i)"
      >
        {{ i }}
      </a>
    </li>
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage === numberOfPages}"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="nextPage">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>        
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    paginationData: {
      type: Object,
      required: true,
      default: () => { }
    }
  },
  computed: {
    numberOfPages() {
      return this.paginationData.pages;
    },
    currentPage() {
      return this.paginationData.page;
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit('update:page', this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.numberOfPages) {
        this.$emit('update:page', this.currentPage + 1);
      }
    },
    gotoPage(pageNumber) {
      this.$emit('update:page', pageNumber);
    }    
  }
};
</script>
