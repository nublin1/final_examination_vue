<template>
  <ul class="colors colors--black">
    <li v-for="(color) in colors" :key="color.id" class="colors__item">
      <label class="colors__label">
        <input
          :id="'productColorInput' + color.id"
          v-model="currentColorId"
          class="colors__radio sr-only"
          type="radio"
          :name="'productColorInput' + productId"
          :value="color.id"
          :checked="color.id === currentColorId"
          @change="handleColorChange(color.id)"
        >
        <span
          class="colors__value"
          :style="{ 'background-color': color.code }"
        />
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      required: true,
    },
    productIdRaw: {
      type: Number,
      default:0,
    }
  },
  emits: ['updateColor'],  
  data() {
    return {
      selectedColorId: null,
    }
  },
  computed: {
    currentColorId: {
      get() {
        return this.colors[0].id;
      },
      set(value) {
        this.selectedColorId = value;
      }
    },
    productId() {
      return this.productIdRaw ? this.productIdRaw : null;
    }
    
  },
  methods: {
    handleColorChange(id) {
      const index = this.colors.findIndex(color => color.id === id);
      if (index !== -1) {
        this.selectedColorId = id;
        this.$emit('updateColor', this.colors[index]);
      }
    }        
  }
}
</script>

<style lang="scss" scoped>
.colors__value {
  border: 1px solid #bbb;
}
.colors__label:checked ~ .colors__value:before {
  border-color: #777;
}
</style>