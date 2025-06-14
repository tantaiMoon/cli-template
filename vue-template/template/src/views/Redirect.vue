<script lang="ts">
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()

    router.replace({
      path: '/' + route.params.path,
      query: route.query
    })
  },
  render() {
    return h('template')
  }
}
</script>

<style scoped lang="scss"></style>
