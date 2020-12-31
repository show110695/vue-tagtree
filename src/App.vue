<template>
  <div id="app">
    <div>
      <tagtree
        title="栏目选择"
        width="300"
        :dataList="columnList"
        :props="defaultProps"
        nodeKey="subjectUuid"
      >
      </tagtree>
    </div>
  </div>
</template>

<script>
import tagtree from "./components/tagtree.vue";

export default {
  name: "App",
  components: {
    tagtree,
  },
  data() {
    return {
      defaultProps: {
        label: "name",
        children: "subjectList",
      },
      columnList: [
        {
          name: "栏目1",
          subjectUuid: "1",
          subjectList: [
            {
              name: "栏目1-1",
              subjectUuid: "1-1",
            },
          ],
        },
        {
          name: "栏目2",
          subjectUuid: "2",
          subjectList: [],
        },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
