<template>
  <div class="tag-tree">
    <span class="block-tag" :style="`min-width: ${width}px`">
      <el-tag size="small" class="tag" v-for="(tag, index) in selectedNodes" :key="index" :closable="tagClosable" @close="handleTagClose(index)" type="warning">{{ tag[props.label].replace(/&lt;[^>]+>/g, "") }}</el-tag>
    </span>
    <el-button @click="openTree" v-show="tagClosable" type="primary" size="medium">
      <i class="el-icon-edit-outline"></i>
    </el-button>
    <el-dialog lock-scroll :title="title" :visible="showDialog" :before-close="handleDialogClose" :width="dialogWidth" :modal-append-to-body="false" :modal="dialogModal">
      <el-input class="search" placeholder="请输入关键字" v-model="keyword" clearable @keyup.enter.native="searchFunc" size="medium"></el-input>
      <span>
        <el-button type="primary" @click="searchFunc" size="medium"> <i class="el-icon-search"></i>查询 </el-button>
        <el-button type="primary" @click="confirm" size="medium"> <i class="el-icon-check"></i>保存 </el-button>
        <el-button @click="resetTree()" size="medium"> <i class="el-icon-close"></i>重置 </el-button>
      </span>
      <el-scrollbar style="height:400px;width:100%">
        <el-tree v-loading="dialogLoading" class="tree" ref="tree" :node-key="nodeKey" :data="dataList" show-checkbox :check-strictly="checkStrictly" :default-expanded-keys="defaultChecked" :default-checked-keys="defaultChecked" :filter-node-method="filterNode" :expand-on-click-node="false" @check-change="handleCheckChange" :props="defaultProps" @check="check" @node-click="nodeClick">
          <span slot-scope="{ node }">
            <span v-html="node.label"></span>
          </span>
        </el-tree>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tagtree',
  data() {
    return {
      selectedNodes: [],
      showDialog: false,
      keyword: "",
      rootChecked: false,
      defaultProps: {
        label: this.props.label,
        children: this.props.children,
        disabled: this.disableFn
      },
      disabledNodes: "" // 存储禁用的子节点字符串
    };
  },
  props: {
    // 对话框标题
    title: String,
    // 输入框宽度
    width: {
      type: String,
      required: false,
      default: "800"
    },
    dialogWidth: {
      type: String,
      required: false,
      default: "40%"
    },
    // 节点key属性名称
    nodeKey: {
      type: String,
      required: false,
      default: "id"
    },
    // tree绑定数据
    dataList: {
      type: Array,
      required: true
    },
    // 默认选中节点，id数组
    defaultChecked: {
      type: Array,
      required: false
    },
    // 节点是否全部展开
    defaultExpandAll: {
      type: Boolean,
      required: false,
      default: false
    },
    // 开启遮罩层
    dialogModal: {
      type: Boolean,
      required: false,
      default: true
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        label: "label",
        children: "children"
      })
    },
    // 是否单选
    onlyOne: {
      type: Boolean,
      required: false
    },
    // 父子节点是否相互关联,true不关联、false关联
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 默认展开节点
    defaultExpandedKeys: {
      type: Array
    },
    // 标签是否可关闭
    tagClosable: {
      type: Boolean,
      required: false,
      default: true
    },
    dialogLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否开启父节点选中禁用子节点
    disableChildren: {
      type: Boolean,
      default: false
    },
    // 是否开启禁用所有父节点
    disableParent: {
      type: Boolean,
      default: false
    },
    // 复选框单选
    oneChecked: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    disableFn(data, node) {
      if (this.disableParent && node.childNodes.length > 0) {
        return true;
      }
      if (this.disableChildren && this.disabledNodes.indexOf(JSON.stringify(data)) > -1) {
        node.checked = false;
        return true;
      }
      if (this.rootChecked && data[this.nodeKey] != "0" && data[this.nodeKey] != "") {
        node.checked = false;
        return true;
      } else {
        return false;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) != -1;
    },
    // 设置默认标签(供外部调用)，传参id或label数组
    setDefaultTags(keys) {
      this.$nextTick(() => {
        this.setTags(this.dataList, keys);
        this.$emit("update-data", this.selectedNodes);
      });
    },
    // 设置默认标签
    setTags(obj, keys) {
      for (let v in obj) {
        let element = obj[v];
        if (keys.indexOf(element[this.nodeKey]) > -1 || keys.indexOf(element[this.props.label]) > -1) {
          this.selectedNodes.push(element);
        }
        if (this.selectedNodes.length < keys.length && element[this.props.children] != undefined) {
          this.setTags(element[this.props.children], keys);
        }
      }
    },
    // 保存并关闭dialog
    confirm() {
      this.selectedNodes = this.$refs.tree.getCheckedNodes();
      this.$emit("update-data", this.selectedNodes);
      this.showDialog = false;
      this.keyword = "";
    },
    // 直接关闭dialog,不保存
    handleDialogClose(done) {
      this.showDialog = false;
      this.keyword = "";
      this.$refs.tree.filter();
      done();
    },
    // 重置栏目树
    resetTree() {
      this.$refs.tree.setCheckedNodes([]);
      this.keyword = "";
      this.$refs.tree.filter();
    },
    // 打开栏目树
    openTree() {
      this.showDialog = true;
      this.$emit("showDialogTagtree", true); // 告诉父组件点击了tag-tree
      // 首次打开tree未生成，延时设置nodes
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.selectedNodes);
      });
    },
    // 标签关闭
    handleTagClose(index) {
      this.selectedNodes.splice(index, 1);
      this.$emit("update-data", this.selectedNodes);
    },
    // 根节点选中禁用子节点
    handleCheckChange(data, checked) {
      // oneChecked为true是复选框单选
      if (this.oneChecked == true) {
        if (checked == true) {
          this.$refs.tree.setCheckedNodes([data]);
        }
      } else {
        if (data[this.nodeKey] == "0" || data[this.nodeKey] == "") {
          this.rootChecked = checked;
        }
        if (this.disableChildren && data[this.props.children] != undefined && data[this.props.children].length > 0) {
          if (checked) {
            this.disabledNodes += JSON.stringify(data[this.props.children]);
          } else {
            let temp = JSON.stringify(data[this.props.children]);
            this.disabledNodes = this.disabledNodes.replace(temp, "");
          }
        }
      }
    },
    // 单选
    check(a, b) {
      if (this.onlyOne == "true") {
        if (b.checkedKeys.length > 0) {
          this.$refs.tree.setCheckedKeys([a[this.nodeKey]]);
        }
      }
    },
    nodeClick(data) {
      // oneChecked为true是复选框单选，onlyOne为true是纯单选
      if (this.oneChecked == true) {
        this.$refs.tree.setCheckedNodes([data]);
      } else {
        if (this.onlyOne == true) {
          this.selectedNodes = [data];
          this.showDialog = false;
          // 单选时拿值
          this.$emit("update-data", data);
        }
      }
    },
    handleOnlyoneClose() {
      this.selectedNodes = [];
      this.$emit("update-data", {});
    },
    // 点击查询
    searchFunc() {
      this.$refs.tree.filter(this.keyword);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tag-tree {
  display: inline-block;
  .block-tag {
    border: 1px solid #dcdfe6;
    display: inline-block;
    min-height: 32px;
    border-radius: 4px;
    vertical-align: middle;
    line-height: 0;
    margin-right: 5px;
    .tag {
      margin: 3px;
    }
  }
  .search {
    width: 40%;
    margin: 0 20px 10px 0;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
