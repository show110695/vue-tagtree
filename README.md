### vue-tagtree

#### 一、安装
```
npm install vue-tagtree
```

#### 二、使用方法

##### 1、html

```
<tagtree 
        title="栏目选择"
        width="300"
        :dataList="columnList"
        :props="defaultProps"
        nodeKey="subjectUuid"
></tagtree>
```

##### 2、js
```
import tagtree from 'vue-tagtree'
import 'vue-tagtree/dist/tagtree.css'
export default {
  components: {
    tagtree
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
      ]
    };
  }
};
```

#### 三、API

##### 1、Attributes属性

| 属性             | 说明                 | 类型    | 默认值                                 |
| ---------------- | -------------------- | ------- | -------------------------------------- |
| title            | 弹窗标题             | String  | 如“栏目选择”                           |
| width            | 框的宽度             | String  | “800”                                  |
| dialogWidth      | 弹窗宽度             | String  | “40%”                                  |
| nodeKey          | 节点id               | String  | “Id”                                   |
| dataList         | 数据，必选           | Array   |                                        |
| defaultChecked   | 默认选中节点，id数组 | Array   | 如["1","2"]                            |
| defaultExpandAll | 节点是否全部展开     | Boolean | false                                  |
| dialogModal      | 开启遮罩层           | Boolean | true                                   |
| props            | 自定义树节点属性     | Object  | { label: "label",children: "children"} |
|                  |                      |         |                                        |
|                  |                      |         |                                        |

