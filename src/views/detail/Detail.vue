<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImage="detailImage"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>

    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top v-show="showBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import DetailNavBar from "./detailComps/DetailNavBar";
  import DetailSwiper from "./detailComps/DetailSwiper";
  import DetailBaseInfo from "./detailComps/DetailBaseInfo";
  import DetailShopInfo from "./detailComps/DetailShopInfo";
  import DetailGoodsInfo from "./detailComps/DetailGoodsInfo";
  import DetailParamInfo from "./detailComps/DetailParamInfo";
  import DetailCommentInfo from "./detailComps/DetailCommentInfo";
  import DetailBottomBar from "./detailComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,getRecommend, Goods,Shop,GoodsParam} from "network/detail";
  import {debounce} from "comment/utils";
  import {itemListenerMixin,showBackTopMixin} from 'comment/mixin';
  import BackTop from "components/content/backTop/BackTop";

  import {mapActions} from 'vuex';

  export default {
        name: 'Detail',
        mixins: [itemListenerMixin,showBackTopMixin],
        components: {
            BackTop,
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            Scroll,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar
        },
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [0],
                getThemeTopYs: null,
                currentIndex: 0
            }
        },
        created() {
            //1.获取iid
            this.iid = this.$route.params.iid

            //2.请求详情数据
            getDetail(this.iid).then(res => {

                // console.log(res);
                //1.获取数据
                const data = res.result;
                //2.获取顶部的图片轮播数据
                this.topImages = data.itemInfo.topImages

                //3.获取商品信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

                //4.获取商品信息
                this.shop = new Shop(data.shopInfo)

                //5.获取商品详细信息
                this.detailInfo = data.detailInfo

                //6.获取参数信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
                //7.获取出评论信息
                if(data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0]
                }

            })
            //3.请求详情数据
            getRecommend().then((res) => {
              this.recommends = res.data.list
            })
            //4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                this.themeTopYs.push(Number.MAX_VALUE)
                // console.log(this.themeTopYs)
            },100)
        },
      mounted() {
      },
      destroyed() {
          this.$bus.$off('itemImageLoad',this.itemImageListener)

      },
      methods: {
            ...mapActions(['addCart']),
         detailImage() {
              this.newRefresh()
              // this.$refs.scroll.refresh()
              this.getThemeTopY()
          },
          titleClick(index) {
              // console.log(index)
              this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
          },
          contentScroll(position) {
              const pageY = -position.y
              const length = this.themeTopYs.length
              for(let i = 0; i < length-1; i++){
                  if((this.activeIndex !== i) && ((pageY >= this.themeTopYs[i] && pageY < this.themeTopYs[i+1]))){
                      this.activeIndex = i
                      this.$refs.nav.currentIndex = this.activeIndex
                  }
              }
              this.toBackTop(position)
          },
          addToCart() {
             //1.获取购物车需要展示的信息
              const product = {}
              product.image = this.topImages[0];
              product.title = this.goods.title;
              product.desc = this.goods.desc;
              product.price = this.goods.realPrice;
              product.iid = this.iid;
              // console.log(product);
              //2.将商品添加到购物车里
              // this.$store.commit('addCart',product)
              this.addCart(product).then(res => {
                  console.log(res)
              })

              // this.$store.dispatch('addCart',product).then(res => {
              //     console.log(res);
              // })

          }
      }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }
  .content {
    height: calc(100% - 44px);
  }
</style>
