<template>
  <div
    v-for="delivery in deliveres"
    :key="delivery.id"
  >
    {{ delivery.title }} - {{ $filters.priceFormat(delivery.price) }} ₽
  </div>
</template>

<script>
import API_BASE_URL from '@/config';

const axios = require('axios').default;

export default {
  props: {
    content: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      deliveres: [],
      deliveresIsLoaded: false,
      deliveresError: false,
    }
  },
  created() {
    this.loadDeliveries();
  },
  methods: {
    loadDeliveries() {
      this.deliveresIsLoaded = false;
      this.deliveresError = false;
      clearTimeout(this.deliveresTimer);
      this.deliveresTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}api/deliveries`)
          .then((response) => {
            this.deliveres = response.data;
            this.deliveresIsLoaded = true;
            this.deliveresError = false;
          })
          .catch(() => {
            this.deliveresIsLoaded = false;
            this.deliveresError = true;
          })
      }, 0);
    }
  }
};
</script>