<template>
  <div
    v-if="color"
    class="item__pics pics"
  >
    <div class="pics__wrapper">
      <img
        width="570"
        height="570"
        :src="getMainImageSrc()[0]?.file.url"
        alt="Название товара"
      >
    </div>
    <ul class="pics__list">
      <li
        v-for="(item) in color"
        :key="'pic' + item.id"
        class="pics__item"
      >
        <a
          class="pics__link"
          :class="{ 'pics__link--current': item.id === colorId }"
          @click.prevent="colorId = item.id"
        >
          <img
            width="98"
            height="98"
            :src="getThumbnailImageSrc(item)"
            alt="Название товара"
          >
        </a>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  props: {
    color: {
      type: Array,
      required: true,
      default: () => [],
    },
    selectedColorId: {
      type: Number,
      required: true,
    }
  },
  emits: ['updateColor'],
  computed: {
    colorId: {
      get() {
        return this.selectedColorId;
      },
      set(value) {
        this.$emit('updateColor', value);
      }
    }
  },
  methods: {
    getMainImageSrc() {
      if (Array.isArray(this.color) && this.color.length > 0) {
        const index = this.color.findIndex(color => color.id === this.selectedColorId);
        if (index !== -1) {
          const gal = this.color[index].gallery;
          if (gal) {
            return gal
          }
          else {
            return [{
              file: {
                extension: "webp",
                name: "not-img.webp",
                originalName: "not-img.webp",
                size: "4 Кб",
                url: "/img/not-img.webp"
              }
            }];
          }
        }
      }
    },
    getThumbnailImageSrc(item) {
      const gallery = item.gallery;
      if (gallery && gallery.length > 0 && gallery[0].file && gallery[0].file.url) {
        return gallery[0].file.url;
      }
      // Возвращает URL изображения по умолчанию или пустую строку, если изображение недоступно
      return '/img/not-img.webp';
    }
  }
}
</script>