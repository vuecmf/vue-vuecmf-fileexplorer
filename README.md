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
import "bootstrap-icons/font/bootstrap-icons.css"

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
      :tool_config="['new_folder','update_folder','move_folder','del_folder','upload','move_file','del_file','remark_file']"
      upload_api="http://localhost:8080/web/upload"
      :headers="{token:'0b9d5a83a8c63670015d970c540eb17e'}"
      :data="{user:'vuecmf'}"
      @loadFolder="loadFolder"
      @moveFolder="moveFolder"
      @saveFolder="saveFolder"
      @delFolder="delFolder"
      @loadFile="loadFile"
      @selectFile="selectFile"
      @moveFile="moveFile"
      @delFile="delFile"
      @saveFile="saveFile"
      @remarkFile="remarkFile"
      @beforeUpload="beforeUpload"
      @onUploadSuccess="onUploadSuccess"
      @onUploadError="onUploadError"
      @fileSortChange="fileSortChange"
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
    
    //保存文件
    const saveFile = (data:AnyObject):void => {
      console.log(data)
    }
    
    //备注文件
    const remarkFile = (data:AnyObject):void => {
      console.log(data)
      //重新加载文件列表
      data.loadFile()
    }
    
    //文件列表排序事件
    const fileSortChange = (data:AnyObject):void => {
      console.log(data)
      //重新加载文件列表
      data.loadFile()
    }
    
    //上传文件前
    const beforeUpload = (data:AnyObject):void => {
       console.log("before upload: ",data)
    }

    //上传文件成功返回数据时
    const onUploadSuccess = (data:AnyObject):void => {
       console.log('success = ',data)
    }

    //上传文件失败
    const onUploadError = (data:AnyObject):void => {
        console.log('error = ', data)
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
      saveFile,
      remarkFile,
      fileSortChange,
      
      beforeUpload,
      onUploadSuccess,
      onUploadError
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

headers：设置上传的请求头部

data：上传时附带的额外参数

### 事件说明

loadFolder: 加载文件夹列表

moveFolder: 移动文件夹

saveFolder: 保存文件夹

delFolder: 删除文件夹

loadFile: 加载文件列表

selectFile: 选择文件

moveFile: 移动文件

delFile: 删除文件

remarkFile: 备注文件

saveFile: 保存文件名等信息

fileSortChange: 文件列表排序回调事件

beforeUpload: 文件上传前

onUploadSuccess： 文件上传成功

onUploadError： 文件上传失败

onPreview： 点击文件列表中已上传的文件时的钩子

onRemove： 文件列表移除文件时的钩子

onProgress： 文件上传时的钩子

onChange： 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用

onExceed： 当超出限制时，执行的钩子函数


