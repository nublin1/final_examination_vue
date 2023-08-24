import { createStore } from 'vuex'
import API_BASE_URL from '@/config';

const axios = require('axios').default;

export default createStore({
  state: {
    accessKey: null,
    basket: [],
    orderInfo: {},
  },
  getters: {
    // checkItemInBusketById(id) {
    //   if (busket && busket.items.length > 0) {
    //     const item = busket.items.array.forEach(element => {
    //       element.id === id;
    //     });
    //     return item;
    //   }
    //   return null;
    // }
    culculateTotalPrice(state) {
      if (state.basket.items && state.basket.items.length > 0) {
        return state.basket.items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0);
      }
    },
    itemsCount(state) {
      if (state.basket.items && state.basket.items.length > 0)
        return state.basket.items.length;
      else return 0
    },
    getOrderInfo(state) {
      return state.orderInfo
    }
  },
  mutations: {
    updateAccessKey(state, accessKey) {
      state.accessKey = accessKey
    },
    updateBasket(state, basket) {
      state.basket = basket
    },
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo
    }
  },
  actions: {
    loadAccessKey(context) {
      return axios.get(`${API_BASE_URL}api/users/accessKey`, {})
        .then((response) => {
          localStorage.setItem('accessKey', response.data.accessKey);
          context.commit('updateAccessKey', response.data.accessKey);
        })
    },
    loadBasket(context) {
      return axios.get(`${API_BASE_URL}api/baskets`, {
        params: {
          userAccessKey: context.state.accessKey
        }
      })
        .then((response) => {
          context.commit('updateBasket', response.data);
        })
    },
    deleteFromBasket(context, id) {
      return axios
        .delete(`${API_BASE_URL}api/baskets/products`, {
          data: {
            basketItemId: id,
          },
          params: {
            userAccessKey: context.state.accessKey,
          },
        })
        .then((response) => {
          // Обработка успешного ответа, если необходимо
          //console.log('Успешно удалено из корзины', response.data);
          context.commit('updateBasket', response.data);
          
        })
        .catch((error) => {
          // Обработка ошибки, если необходимо
          console.error('Ошибка при удалении из корзины', error);
          // Выполните другие действия, которые вам необходимо сделать при ошибке удаления
        });
    },
  },
  modules: {
  }
})
