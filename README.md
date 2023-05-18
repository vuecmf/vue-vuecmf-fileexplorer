# vue-vuecmf-fileexplorer

> 基于vue3、Element Plus和TypeScript的文件管理器组件，支持文件夹管理、上传及下载文件等功能

- 示例演示： http://www.vuecmf.com

## 安装

``` bash
# yarn方式安装 vue-vuecmf-fileexplorer
yarn add vue-vuecmf-fileexplorer

# npm方式安装 vue-vuecmf-fileexplorer
npm install vue-vuecmf-fileexplorer
```

###1、先在项目中的main.ts 引入
```
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'

/*导入组件*/
import VuecmfFileexplorer from "vue-vuecmf-fileexplorer"

createApp(App).use(VuecmfFileexplorer).mount('#app')
```

## 模板中使用组件

```
<template>
  <h3>vuecmf-fileexplorer demo</h3>

  <vuecmf-fileexplorer
      root_path="uploads"
      :page_size="30"
      list_show="list"
      :tool_config="['new_folder','update_folder','move_folder','del_folder','upload','move_file','del_file']"
      upload_api="http://localhost:8080/web/upload"
      @loadFolder="loadFolder"
      @moveFolder="moveFolder"
      @saveFolder="saveFolder"
      @delFolder="delFolder"
      @loadFile="loadFile"
      @selectFile="selectFile"
      @moveFile="moveFile"
      @delFile="delFile"
  >
  </vuecmf-fileexplorer>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {AnyObject} from "../packages/vue-vuecmf-fileexplorer/src/typings/vuecmf";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'App',
  setup(){
    //加载文件夹列表
    const loadFolder = (folderObj: AnyObject):void => {
      console.log(folderObj)
      folderObj.data[0].children = [
        {
          "id": 1,
          "title": "food",
          "pid": 0,
          "children": [
            {
              "id": 4,
              "title": "bread",
              "pid": 1,
              "children": null
            },
            {
              "id": 5,
              "title": "vegetable",
              "pid": 1,
              "children": null
            }
          ]
        },
        {
          "id": 2,
          "title": "hotel",
          "pid": 0,
          "children": null
        }
      ]

    }

    //保存文件夹
    const saveFolder = (folderData: AnyObject):void => {
      console.log(folderData)
    }

    //移动文件夹
    const moveFolder = (data:AnyObject):void => {
      console.log(data)
      //重新加载文件夹列表及文件列表
      data.loadFolder()

    }

    //删除文件夹
    const delFolder = (folderData: AnyObject):void => {
      console.log(folderData)
    }

    //加载文件列表
    const loadFile = (folderObj: AnyObject):void => {
      console.log(folderObj)
      folderObj.total = 16
      folderObj.data = []
      for(let i = 1; i <= 16; i++) {
        folderObj.data.push({
          "id": i,
          "file_name": "hamburger"+i+".png",
          "ext": "png",
          "size": "120kb",
          "dir_id": 4,
          "url": "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
          "remark": "",
          "create_time": "2023-05-16 16:13:33",
          "update_time": "2023-05-18 15:17:35",
        })
      }

    }

    //选择文件事件
    const selectFile = (files:AnyObject):void => {
      console.log('当前选择的文件信息：', files)
    }

    //移动文件
    const moveFile = (data:AnyObject):void => {
      console.log(data)
      //重新加载文件列表
      data.loadFile()
    }

    //删除文件
    const delFile = (data:AnyObject):void => {
      console.log(data)
      //重新加载文件列表
      data.loadFile()
    }

    return {
      loadFolder,
      saveFolder,
      moveFolder,
      delFolder,
      loadFile,
      selectFile,
      moveFile,
      delFile,
    }
  }
});
</script>

```
详细使用见 源码中 examples目录中示例

### 属性说明

root_path：当前文件夹根目录，默认uploads

page_size：每页显示文件数量，默认30

list_show: 文件列表显示方式 card/list, 默认card

upload_api：上传文件后端API， 默认空

tool_config：工具条功能配置， 默认所有功能（'new_folder','update_folder','move_folder','del_folder','upload','move_file','del_file'）

### 事件说明

loadFolder: 加载文件夹列表

moveFolder: 移动文件夹

saveFolder: 保存文件夹

delFolder: 删除文件夹

loadFile: 加载文件列表

selectFile: 选择文件

moveFile: 移动文件

delFile: 删除文件


