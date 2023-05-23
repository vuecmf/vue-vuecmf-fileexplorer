<template>
  <h3>vuecmf-fileexplorer demo</h3>

  <vuecmf-fileexplorer
      root_path="uploads"
      :page_size="30"
      list_show="list"
      :tool_config="['new_folder','update_folder','move_folder','del_folder','upload','move_file','del_file']"
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
      @beforeUpload="beforeUpload"
      @onUploadSuccess="onUploadSuccess"
      @onUploadError="onUploadError"
      @onPreview="onPreview"
      @onRemove="onRemove"
      @onProgress="onProgress"
      @onChange="onChange"
      @onExceed="onExceed"
  >
  </vuecmf-fileexplorer>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {AnyObject} from "../packages/vue-vuecmf-fileexplorer/src/typings/vuecmf";
import Model from "../packages/vue-vuecmf-fileexplorer/src/Model";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'App',
  setup(){
    //const token = '0b9d5a83a8c63670015d970c540eb17e'
    //const api = new Model(token)

    //加载文件夹列表
    const loadFolder = (folderObj: AnyObject):void => {
        /*api.post('http://localhost:8080/web/file_dir',{wid:'c97c1b3671fef2055e175ca2154d217a', data:{keywords:folderObj.keywords}}).then((res:AnyObject) => {
          if(res.status == 200){
            if(res.data.code == 0){
              folderObj.data[0].children = res.data.data.data
            }else{
              ElMessage.error(res.data.msg)
            }
          }else{
            ElMessage.error(res.toString())
          }
        })*/
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
      /*api.post('http://localhost:8080/web/file_dir/save',{
        wid:'c97c1b3671fef2055e175ca2154d217a',
        data: { title: folderData.folder_name, id: folderData.folder_value, pid: folderData.folder_pid }
      }).then((res:AnyObject) => {
        if(res.status == 200){
          if(res.data.code == 0){
            folderData.loadFolder()
            ElMessage.success(res.data.msg)
          }else{
            ElMessage.error(res.data.msg)
          }
        }else{
          ElMessage.error(res.toString())
        }
      })*/
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
      /*api.post('http://localhost:8080/web/file_dir/delete',{
        wid:'c97c1b3671fef2055e175ca2154d217a',
        data: { id: folderData.id }
      }).then((res:AnyObject) => {
        if(res.status == 200){
          if(res.data.code == 0){
            folderData.loadFolder()
            ElMessage.success(res.data.msg)
          }else{
            ElMessage.error(res.data.msg)
          }
        }else{
          ElMessage.error(res.toString())
        }
      })*/

      console.log(folderData)
      folderData.loadFolder()

    }

    //加载文件列表
    const loadFile = (fileObj: AnyObject):void => {
      /*api.post('http://localhost:8080/web/file_explorer',{
        wid:'c97c1b3671fef2055e175ca2154d217a',
        data:{
          keywords: fileObj.keywords,
          filter: fileObj.filter,
          page: fileObj.current_page,
          page_size: fileObj.page_size
        }
      }).then((res:AnyObject) => {
        if(res.status == 200){
          if(res.data.code == 0){
            fileObj.data = res.data.data.data
            fileObj.total = res.data.data.total
          }else{
            ElMessage.error(res.data.msg)
          }
        }else{
          ElMessage.error(res.toString())
        }
      })*/
      console.log(fileObj)
      fileObj.total = 16
      fileObj.data = []
      for(let i = 1; i <= 16; i++) {
        fileObj.data.push({
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

    //点击文件列表中已上传的文件时的钩子
    const onPreview = (data:AnyObject):void => {
      console.log('error = ', data)
    }

    //文件列表移除文件时的钩子
    const onRemove = (data:AnyObject):void => {
      console.log('error = ', data)
    }

    //文件上传时的钩子
    const onProgress = (data:AnyObject):void => {
      console.log('error = ', data)
    }

    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    const onChange = (data:AnyObject):void => {
      console.log('error = ', data)
    }

    //当超出限制时，执行的钩子函数
    const onExceed = (data:AnyObject):void => {
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

      beforeUpload,
      onUploadSuccess,
      onUploadError,
      onPreview,
      onRemove,
      onProgress,
      onChange,
      onExceed,
    }
  }
});
</script>


