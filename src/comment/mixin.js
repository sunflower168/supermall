import {debounce} from "comment/utils";
import BackTop from 'components/content/backTop/BackTop.vue';

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      newRefresh: {}
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 200)
    this.itemImageListener = () => {
      this.newRefresh()
    }
    // 监听item中图片加载完毕
    this.$bus.$on('itemImageLoad', this.itemImageListener)
    return this.newRefresh
  }
}

export const showBackTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      showBackTop: false,
    }
  },
  methods: {
    backClick() {
      // console.log("backClick");
      this.$refs.scroll.scrollTo(0, 0)
    },
    toBackTop(position) {
      // 回到顶部显示与隐藏
      this.showBackTop = false
      if (position.y < -1000) {
        this.showBackTop = true
      }
    }
  }
}
