<template>
  <div class="cart">
<!--    导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
<!--    商品列表-->
    <cart-list/>
<!--    底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  import CartList from "./childComps/CartList";
  import CheckButton from "components/content/checkButton/CheckButton";

  import { mapGetters} from 'vuex'
  import CartBottomBar from "./childComps/CarBottonBar";

    export default {
        name: 'Cart',
        components: {
            CartBottomBar,
            NavBar,
            CartList,
            CheckButton
        },
        computed: {
            // ...mapGetters(['cartlength'])
            ...mapGetters({
                length: 'cartLength'
            })
        }
    }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
</style>
