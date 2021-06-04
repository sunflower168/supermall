<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control  :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control  :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                    ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top v-show="showBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
    import HomeSwiper from "./childComps/HomesSwiper";
    import RecommendView from "./childComps/RecommendView";
    import FeatureView from "./childComps/FeatureView";

    import NavBar from "components/common/navbar/NavBar";
    import TabControl from "components/content/tabControl/TabControl";
    import GoodsList from "components/content/goods/GoodsList";
    import Scroll from "components/common/scroll/Scroll";
    // import BackTop from "components/content/backTop/BackTop";

    import {getHomeMultidata,getHomeGoods} from "network/home";
    import {debounce} from "comment/utils";
    import {itemListenerMixin,showBackTopMixin} from 'comment/mixin';


    export default {
        name: 'Home',
        mixins: [itemListenerMixin,showBackTopMixin],
        components: {
            NavBar,
            HomeSwiper,
            RecommendView,
            FeatureView,
            TabControl,
            GoodsList,
            Scroll,
            // BackTop

        },
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {page:0,list: []},
                    'new': {page:0,list: []},
                    'sell': {page:0,list: []},
                },
                currentType: 'pop',
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0
            }
        },
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            }
        },
        activated() {
            this.$refs.scroll.scrollTo(0,this.saveY,0)
            this.$refs.scroll.scroll.refresh()
        },
        deactivated() {
            //1.保存Y值
            this.saveY = this.$refs.scroll.getScroll()

            //2.取消全局事件的监听
            this.$bus.$off('itemImageLoad',this.itemImageListener)
        },
        created() {
            //1.请求多个数据
            this.getHomeMultidata()

            //2.请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')
        },
        mounted() {
        },
        methods: {
            // 事件监听相关的方法
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;
            },
            contentScroll(position) {
                //1.判断BackTop是否显示
                // this.isShowBackTop = -position.y > 1000

                //2.决定tabControl是否吸顶(position:fixed)
                this.isTabFixed = (-position.y) > this.tabOffsetTop
                this.saveY = position.y
                this.toBackTop(position)

            },
            loadMore() {
                this.getHomeGoods(this.currentType)

                this.$refs.scroll.scroll.refresh()
            },
            swiperImageLoad() {
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
            },
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    // this.result = res;
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                })
            },
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type,page).then(res => {
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1
                    //完成上拉加载更多
                    this.$refs.scroll.finishPullUp()
                })
            }
        }
    }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  /*百分百视口*/
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
    font-size: 18px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;

    z-index: 9;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
