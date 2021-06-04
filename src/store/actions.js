import  {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-type";
export default {
  addCart(context,payload) {
    // state.cartList.push(payload)
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER,oldProduct)
        resolve("商品数量加一")
      } else {
        // context.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve("添加购物车成功")
      }
    })
    
  }
}
