可拖放和修改尺寸的流式网格布局
===========================
-------------------------------

### 安装
```bash
npm i jd-row --save
```

### 使用
```javascript
import JdRow from "jd-row";

const app = createApp(App);
app.use(JdRow).mount("#app");
```

#### 使用
###### 定义行高和列数，列宽自动
```html
<template>
  <jd-row class="home-wrap" :rowSize="9" :rowHeight="60" :rowGap="16" :columnGap="16">
    <jd-col :rowSpan="5" :columnSpan="5" drag resize>1</jd-col>
    <jd-col :rowSpan="5" :columnSpan="4" drag resize>2</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>3</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>4</jd-col>
    <jd-col :rowSpan="6" :columnSpan="3" drag resize>5</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>6</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>7</jd-col>
  </jd-row>
</template>
```
###### 预定义前3行的行高和前3列列宽，其余按照`rowWidth`和`rowHeight`
```html
<template>
  <jd-row class="home-wrap" :rowSize="9" :columns="['100px', '1fr', '10rem']" :rows="['80px', '1fr','5rem']" :rowWidth="100" :rowHeight="60">
    <jd-col :rowSpan="5" :columnSpan="5" drag resize>1</jd-col>
    <jd-col :rowSpan="5" :columnSpan="4" drag resize>2</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>3</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>4</jd-col>
    <jd-col :rowSpan="6" :columnSpan="3" drag resize>5</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>6</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" drag resize>7</jd-col>
  </jd-row>
</template>
```

### jd-row Attributes
| 参数      | 说明           | 类型      | 可选值       | 默认值   |
|---------- |---------------|---------- |-------------  |-------- |
| rowWidth  | 单列宽         | Number   |      —         |   1fr     |
| rowHeight | 单列高         | Number   |      —         |   auto     |
| rowSize   | 每行列数       | Number   |      —         |   24    |
| rowGap    | 行间距         | Number   |      —         |   0     |
| columnGap | 列间距         | Number   |      —         |   0     |
| columns   | 预定义的列宽（会覆盖rowWidth）   | Array[String]   |      —         |   —     |
| rows      | 预定义的行高（会覆盖rowHeight）   | Array[String]   |      —         |   —     |

### jd-col Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| rowSpan   | 跨行数        | Number  |      —     |   1     |
| columnSpan| 跨列数        | Number  |      —     |   1     |
| drag      | 是否可拖放    | Boolean |      —     |   false  |
| resize    | 是否可改变尺寸 | Boolean |      —     |   false |

#### Demo
[Demo](https://flicat.github.io/jdRow/)
