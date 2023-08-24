<template>
  <div
    v-for="(item, index) in gallery"
    :key="getID(item, index)"
    class="catalog__pic"
    href="#"
    @click="$router.push(`/item/${itemId}`)"
  >
    <img :src="item.file.url" :srcset="`${item.file.url} 2x`" :alt="item.file.originalName">
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      required: true,
    },
    choosetColorObj: {
      type: Object,
      required: true,
      default() {},
    },
    itemId: {
      type: Number,
      required: true,
      default: null
    }
  },
  computed: {
    gallery() {
      if (Array.isArray(this.colors) && this.colors.length > 0) {
        const index = this.colors.findIndex(color => color.color.id === this.choosetColorObj.id);
        if (index !== -1) {
          return this.colors[index].gallery;
        }
        return this.colors[0].gallery; // Assuming each color object has a gallery property with an array of gallery items
      } else {
        return [];
      }
    },
  },
  methods: {
    getID(item, index) {
      // Use the item's id if available, otherwise use the index as the key
      return item.id !== undefined ? item.id : index;
    },
  },
};
</script>
