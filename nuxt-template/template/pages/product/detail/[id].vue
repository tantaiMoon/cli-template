<script setup lang="ts">
import type { ProductProps } from '~/types/product'

const route = useRoute()
const {
  data,
  pending,
  status,
  refresh
} = useFetch<ProductProps>(`https://jsonplaceholder.typicode.com/posts/${ route.params?.id }`, {
  pick: ['id', 'body'] // 需要返回的字段
})
console.log('🚀🚀🚀=====>([id].vue:4) data', data.value?.id)
/*const productData = ref<ProductProps | null>(null)
 const { data: product } = useNuxtData(`user:${ route.params.id }`)
 if (product.value) {
 productData.value = product.value
 } else {
 const { data } = useAsyncData(`posts/${ route.params.id }`, () => $fetch<ProductProps>(`https://jsonplaceholder.typicode.com/posts/${ route.params?.id }`))
 productData.value = data.value
 }*/

const sendPost = async () => {
  const data = await useFetch('/api/users/1', {
    method: 'post',
    body: {
      name: 'moyi'
    }
  })
  console.log('🚀🚀🚀=====>([id].vue:25) data', data)
}
</script>

<template>
  <div>
    Product detail : {{ route.params?.id }}, {{ data }}
    {{ pending }}
    <br>
    {{ status }}
    <br>
    <button @click="refresh()">send</button>
    <button @click="sendPost()">send post</button>
  </div>
</template>

<style scoped>

</style>
