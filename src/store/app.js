import Cookies from 'js-cookie';
import Vue from 'vue';

const state = () => ({
  account: undefined,
  accessToken: localStorage.getItem('managementToken'),
});

const getters = {
  isAuth: (state) => !!state.account,
  // capabilities: (state) => state.account.capabilities,
};

const mutations = {
  setAccount(state, account) {
    state.account = account;
  },
  resetAccount(state) {
    state.account = null;
  },
  clear(state) {
    state.account = undefined;
    state.accessToken = undefined;
  },
};

const authStack = async function ({
                                    dispatch,
                                    data,
                                    options = {},
                                  }) {
  localStorage.setItem('managementToken', 'jwt-token');
  await dispatch('identity');
};

const actions = {
  async auth({dispatch}, form) {
    const {data} = await this.$axios.post('/user/auth', form);
    await authStack({
      data: data.data,
      dispatch,
      options: {
        expires: form.remember ? 365 : 7,
      },
    });
  },
  async signup({dispatch}, form) {
    const {data} = await this.$axios.post('/auth/signup', form);

    await authStack({
      data: data.data,
      dispatch,
    });
  },
  async identity({commit}) {
    const {data} = await this.$axios.get('/user/identity');
    commit('setAccount', data.data);
  },
  async updateIdentity({commit}, form) {
    const {data} = await this.$axios.put('user/identity', form);
    commit('setAccount', data.data);
  },
  async confirmEmail({commit}, confirmCode) {
    const {data} = await this.$axios.put('user/change/email/confirm', {confirmCode});
    commit('setAccount', data.data);
  },
  logout({commit}) {
    // Clear stores
    commit('clear');

    Cookies.remove('accessToken', {
      path: '/',
      domain: process.env.AFFILIATE_COOKIE_HOST,
    });
  },
};

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state,
};
