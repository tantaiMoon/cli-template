<script setup lang="ts">
import { useMenuStore } from '@/stores/menus'
import { computed, onMounted, ref } from 'vue'
import RightPanelDrawer from '@/layouts/components/RightPanelDrawer.vue'
import { useMenuHelpers } from '@/views/System/Accesses/menuHelpers'
import Node from 'element-plus/es/components/tree/src/model/node'
import { NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import CreateMenu from '@/views/System/Accesses/components/CreateMenu.vue'

const menuStore = useMenuStore()
const menus = computed(() => menuStore.state.menus)
const menuTree = computed(() => menuStore.state.menuTree)
const count = computed(() => menuStore.state.count)
const pageNum = ref(1)
const pageSize = ref(10)
const {
  editData,
  visible,
  accessTitle,
  editType,
  handleModifyMenu,
  handleAddMenu,
  handleRemoveMenu,
  handleSubmit
} = useMenuHelpers({ pageSize, pageNum })

const defaultProps = {
  children: 'children',
  label: 'title'
}

const handleQuery = () => {
  menuStore.getTree({
    page: pageNum.value,
    size: pageSize.value
  })
}

// 拖拽， 但是一级节点不能拖拽到一级后
const allowDrop = (draggingNode: Node, _dropNode: Node, type: NodeDropType) => {
  if (!draggingNode.data.parentId) {
    return type !== 'inner'
  } else {
    return true
  }
}

const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.parentId
}

const handleNodeDrop = () => {}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="menu-container">
    <h2 px-20px pb-20px m0>菜单管理</h2>
    <div flex w-full>
      <el-card>
        <template #header>
          <el-button type="primary" mb10px @click="handleAddMenu()">添加菜单</el-button>
        </template>
        <div class="menu-tree">
          <el-tree
            :data="menuTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            highlight-current
            draggable
            :allow-drag="allowDrag"
            :allow-drop="allowDrop"
            @node-drop="handleNodeDrop"
            @node-click="handleModifyMenu"
          >
            <template #default="{ data }">
              <div class="flex w-full items-center justify-between">
                <span>{{ data.name }}</span>
                <span>
                  <el-button link @click.stop="handleAddMenu(data)" v-if="data.type !== 'button'">
                    添加
                  </el-button>
                  <el-button link @click.stop="handleRemoveMenu(data)">删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-card>

      <el-card flex-1 ml15px>
        <template #header>
          <span>编辑菜单</span>
        </template>
        <CreateMenu
          v-show="editData && editData.id"
          :type="0"
          :data="editData"
          @submit="handleSubmit"
        />
        <span v-show="!editData">从菜单列表中选择一项后进行编辑</span>
      </el-card>
    </div>

    <RightPanelDrawer v-model="visible" :title="accessTitle">
      <CreateMenu :type="editType" :data="editData" @submit="handleSubmit" />
    </RightPanelDrawer>
  </div>
</template>

<style scoped lang="scss">
.menu-tree {
  @apply min-w-500px min-h-400px max-h-80% overflow-y-auto;
}
</style>
