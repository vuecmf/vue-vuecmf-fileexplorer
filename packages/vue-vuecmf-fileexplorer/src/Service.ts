// +----------------------------------------------------------------------
// | Copyright (c) 2023 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/emei8/vuecmf/blob/master/LICENSE )
// +----------------------------------------------------------------------
// | Author: emei8 <2278667823@qq.com>
// +----------------------------------------------------------------------

import {reactive, ref, toRefs, ToRefs} from "vue";
import {AnyObject} from "./typings/vuecmf";
import {ElMessageBox, ElTable, UploadFile, UploadFiles, UploadInstance, UploadRawFile} from "element-plus";

export default class Service {
    emit: EmitFn<EE[]>

    //基本信息配置
    config = reactive({
        vuecmf_fileexplorer_ref: ref(),
        folder_list_width: ref('220px'), //文件夹区域宽度
        folder_display: ref('display: inline-block'), //文件夹区域显示与隐藏
        filterFolderKeyWord: ref(''), //筛选文件夹关键字
        collapsePadding: ref('padding-left: 10px;'), //折叠按钮边距
        is_collapse: ref(false),  //文件夹是否已折叠
        scrollbar_height: ref('calc(80VH - 45px)'),  //文件夹滚动区域高度
        tool: ref<AnyObject>([]),  //工具条
        is_help_dlg: false,  //是否显示帮助弹窗

        folder_tree_ref: ref(),
        folder: {
            root_path: ref('uploads'), //文件夹根目录
            data: ref<AnyObject>([{id: 0, title: 'uploads', children: ref<AnyObject>([])}]),  //文件夹列表数据
            defaultProps: {
                children: 'children',
                label: 'title',
                value: 'id'
            },
            current_select: ref(), //当前选择的文件夹
            current_select_key: ref(0), //当前选择的文件夹KEY
            folder_dlg: false,  //是否显示文件夹弹窗
            folder_dlg_title: '', //文件夹弹窗标题
            current_pid: ref(0), //当前选择的父级ID
            folder_name: ref(''), //当前文件夹名称
            folder_value: ref(0), //当前文件夹值
            keywords: ref(''), //文件夹搜索关键词
            is_new: true, //是否是新建文件夹

            move_folder_dlg: false, //是否显示移动文件夹弹窗
            move_pid: ref(0), //当前移动到的父级
        },

        file_table_ref: ref(),
        file: {
            table_height: 'calc(80VH - 80px)',        //列表表格高度
            page_layout: "total, prev, pager, next", //分页条展示形式
            current_page: 1, //当前页码数
            page_size: 30,   //每页显示条数
            total: 0, //总条数
            path: '/', //当前文件夹路径
            keywords: ref(''), //文件搜索关键词
            data: ref<AnyObject>(),  //文件列表数据
            filter: ref({}), //文件列表过滤器
            list_show: 'card', //文件列表展示方式 card = 缩略图，list = 列表
            select_files: ref(), //已选择的文件信息

            move_file_dlg: false, //是否显示移动文件弹窗
            move_pid: ref(0), //当前移动到的父级

            upload_file_dlg: false, //是否显示上传文件弹窗
            tableRef: ref<InstanceType<typeof ElTable>>(), //文件列表table实例
            current_input_file: ref(), //当前修改的文件

        },
    })

    constructor(init_config: AnyObject, emit:EmitFn<EE[]>) {
        this.emit = emit
        this.config.folder.root_path = init_config.root_path
        this.config.folder.data[0].title = init_config.root_path.value
        this.config.file.page_size = init_config.page_size
        this.config.file.path = '/' + init_config.root_path.value
        this.config.file.list_show = init_config.list_show.value
        this.config.file.tableRef = init_config.tableRef

        //加载文件夹列表
        this.emit('loadFolder', this.config.folder)
        //加载文件列表
        this.emit('loadFile', this.config.file)

        this.config.tool = [
            { name: 'new_folder', label: '创建文件夹', icon:'bi bi-folder-plus', event: this.openNewFolder, visible: true },
            { name: 'update_folder', label: '修改文件夹', icon:'bi bi-pencil-square', event: this.openUpdateFolder, visible: true },
            { name: 'move_folder', label: '移动文件夹', icon:'bi bi-folder-symlink', event: this.openMoveFolder, visible: true },
            { name: 'del_folder', label: '删除文件夹', icon:'bi bi-folder-x', event: this.delFolder, visible: true },
            { name: 'upload', label: '上传文件', icon:'bi bi-cloud-upload', event: this.openUploadDlg, visible: true },
            { name: 'move_file', label: '移动文件', icon:'bi bi-arrows-move', event: this.openMoveFile, visible: true },
            { name: 'del_file', label: '删除文件', icon:'bi bi-trash', event: this.delFile, visible: true },
        ]

        this.config.tool.forEach((item:AnyObject) => {
            item.visible = init_config.tool_config.value.indexOf(item.name) != -1;
        })

    }

    /**
     * 获取配置参数并导出
     */
    getConfig = (): ToRefs => {
        return toRefs(this.config)
    }

    /**
     * 左侧菜单展开与折叠
     */
    collapse = ():void => {
        if(!this.config.is_collapse){
            this.config.folder_list_width = '46px'
            this.config.is_collapse = true
            this.config.folder_display = 'display: none'
            this.config.collapsePadding = 'padding-left: 4px;'
        }else{
            this.config.folder_list_width = '220px'
            this.config.is_collapse = false
            this.config.folder_display = 'display: inline-block;'
            this.config.collapsePadding = 'padding-left: 10px;'
        }
    }

    /**
     * 文件列表展示方式切换
     * @param type
     */
    changeListShow = (type:string):void => {
        this.config.file.list_show = type
        this.resetTableRowSelect()
    }

    /**
     * 重置列表文件选择状态
     */
    resetTableRowSelect = ():void => {
        if(this.config.file.select_files == null){
            return
        }
        setTimeout(() => {
            this.config.file.select_files.forEach((item:AnyObject)=>{
                if(this.config.file.tableRef != null) this.config.file.tableRef.toggleRowSelection(item, true)
            })
        }, 200)
    }

    /**
     * 创建文件夹
     */
    openNewFolder = ():void => {
        this.config.folder.is_new = true
        this.config.folder.folder_dlg = true
        this.config.folder.folder_dlg_title = '创建文件夹'
        this.config.folder.folder_name = ''
        this.config.folder.folder_value = 0
        this.config.folder.current_pid = 0
    }

    /**
     * 打开修改文件夹弹窗
     */
    openUpdateFolder = ():void => {
        if(this.config.folder.current_select == null){
            ElMessage.error('请先选择文件夹！')
            return
        }
        this.config.folder.is_new = false
        this.config.folder.folder_name = this.config.folder.current_select.title
        this.config.folder.folder_dlg = true
        this.config.folder.folder_dlg_title = '修改文件夹'
        this.config.folder.folder_value = this.config.folder.current_select.id
    }

    /**
     * 修改父级
     * @param selectRow
     */
    changeFolderParent = (selectRow: AnyObject):void => {
        setTimeout(() => {
            this.config.folder.current_pid = selectRow.id
        },100)

    }

    /**
     * 修改移动到父级
     * @param selectRow
     */
    changeMoveFolderParent = (selectRow: AnyObject):void => {
        setTimeout(() => {
            this.config.folder.move_pid = selectRow.id
        },100)
    }

    /**
     * 保存文件夹
     */
    saveFolder = ():void => {
        this.emit('saveFolder', {
            folder_name: this.config.folder.folder_name,
            folder_value: this.config.folder.folder_value,
            folder_pid: this.config.folder.current_pid,
            loadFolder: () => {
                this.emit('loadFolder', this.config.folder)
                this.emit('loadFile', this.config.file)
            }
        })
    }

    /**
     * 打开移动文件夹弹窗
     */
    openMoveFolder = ():void => {
        if(this.config.folder.current_select == null){
            ElMessage.error('请先选择文件夹！')
            return
        }
        if(this.config.folder.data == null){
            ElMessage.error('文件夹列表为空！')
            return
        }
        this.config.folder.move_folder_dlg = true
        this.config.folder.move_pid = 0
    }

    /**
     * 执行移动文件夹操作
     */
    moveFolder = ():void => {
        this.emit('moveFolder', {
            current_id: this.config.folder.current_select.id,
            target_pid: this.config.folder.move_pid,
            loadFolder: () => {
                this.emit('loadFolder', this.config.folder)
                this.emit('loadFile', this.config.file)
            }
        })

        this.config.folder.move_folder_dlg = false
    }

    /**
     * 删除文件夹
     */
    delFolder = ():void => {
        if(this.config.folder.current_select == null){
            ElMessage.error('请先选择文件夹！')
            return
        }

        ElMessageBox.confirm(
            '文件夹及其下面的所有文件将被删除且不可恢复，确定要执行此操作?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            this.emit('delFolder', {
                id:this.config.folder.current_select.id,
                loadFolder: () => {
                    this.emit('loadFolder', this.config.folder)
                    this.config.file.filter = { dir_id: this.config.folder.current_select.pid }
                    this.emit('loadFile', this.config.file)
                    this.config.folder.current_select = null
                }
            })
        }).catch(() => {
            console.log('delete cancel')
        })
    }

    /**
     * 筛选文件夹列表
     */
    searchFolder = (val: string):void => {
        this.config.folder.keywords = val
        this.emit('loadFolder', this.config.folder)
    }

    /**
     * 选择文件夹时，重新加载右边文件列表
     * @param nodeData
     * @param nodeObj
     */
    changeFolder = (nodeData: AnyObject, nodeObj: AnyObject):void => {
        this.config.folder.current_select = nodeData
        this.config.folder.current_select_key = nodeData.id
        this.config.folder.current_pid = nodeData.pid
        //重载右边的文件列表
        this.config.file.filter = { dir_id: nodeData.id }
        this.searchFile()

        //获取当前层级路径
        this.config.file.path = '/' + this.config.folder.root_path
        if(nodeObj.level > 1){
            this.config.file.path = '/' + this.config.folder.root_path +  '/' + this.getFolderPath(nodeData.title, nodeObj)
        }
    }

    /**
     * 获取文件夹层级路径
     * @param path
     * @param nodeObj
     */
    getFolderPath = (path:string, nodeObj: AnyObject):string => {
        if(nodeObj.parent.data.id != 0){
            path = this.getFolderPath(nodeObj.parent.data.title + '/' +  path, nodeObj.parent)
        }
        return path
    }

    /**
     * 搜索文件
     */
    searchFile = ():void => {
        this.emit('loadFile', this.config.file)
    }

    /**
     * 每页显示条数修改
     * @param size 每页显示的条数
     */
    handleSizeChange = (size:number):void => {
        this.config.file.page_size = size
        this.searchFile()
    }

    /**
     * 当前页修改
     * @param page_num 页码
     */
    handleCurrentChange = (page_num: number):void => {
        this.config.file.current_page = page_num
        this.searchFile()
    }

    /**
     * 列表选择文件
     * @param files
     */
    tableSelectionChange = (files: AnyObject):void => {
        this.config.file.select_files = files
        this.emit('selectFile', files)
    }

    /**
     * 点击缩略图
     * @param select_file
     */
    clickCard = (select_file:AnyObject):void => {
        const tmp = []
        let flag = true
        if(this.config.file.select_files == null){
            tmp.push(select_file)
            this.config.file.select_files = tmp
            this.emit('selectFile', tmp)
            return
        }
        this.config.file.select_files.forEach((item:AnyObject)=>{
            if(item.id === select_file.id){
                flag = false
            }else{
                tmp.push(item)
            }
        })

        if(flag) tmp.push(select_file)
        this.config.file.select_files = tmp
        this.emit('selectFile', tmp)
    }

    /**
     * 判断当前文件是否选中
     * @param current_file
     */
    checkFileSelect = (current_file:AnyObject):string => {
        let res = 'card-container'
        if(this.config.file.select_files == null){
            return res
        }
        this.config.file.select_files.forEach((item:AnyObject)=>{
            if(item.id === current_file.id){
                res = 'card-container-select'
                return res
            }
        })
        return res
    }

    /**
     * 修改文件移动到父级
     * @param selectRow
     */
    changeMoveFileParent = (selectRow: AnyObject):void => {
        setTimeout(() => {
            this.config.file.move_pid = selectRow.id
        },100)
    }

    /**
     * 打开上传文件弹窗
     */
    openUploadDlg = ():void => {
        this.config.file.upload_file_dlg = true
    }

    /**
     * 执行上传操作
     */
    submitUpload = (uploadInstance:UploadInstance):void => {
        uploadInstance.submit()
    }

    /**
     * 关闭上传文件窗口
     */
    closeUploadDlg = ():void => {
        this.emit('loadFile', this.config.file)
    }

    /**
     * 打开移动文件弹窗
     */
    openMoveFile = ():void => {
        if(this.config.file.select_files == null || this.config.file.select_files.length == 0){
            ElMessage.error('请先选择文件！')
            return
        }
        if(this.config.folder.data == null){
            ElMessage.error('文件夹列表为空！')
            return
        }
        this.config.file.move_file_dlg = true
        this.config.file.move_pid = 0
    }

    /**
     * 执行移动文件
     */
    moveFile = ():void => {
        const file_id:Array<number> = []
        this.config.file.select_files.forEach((item:AnyObject)=>{
            file_id.push(item.id)
        })

        this.emit('moveFile', {
            select_file_id: file_id.join(','),
            target_pid: this.config.file.move_pid,
            loadFile: () => {
                this.emit('loadFile', this.config.file)
            }
        })
        this.config.file.move_file_dlg = false
    }

    /**
     * 删除文件
     */
    delFile = ():void => {
        if(this.config.file.select_files == null || this.config.file.select_files.length == 0){
            ElMessage.error('请先选择文件！')
            return
        }

        ElMessageBox.confirm(
            '文件删除后不可恢复，确定要执行此操作?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            const file_id:Array<number> = []
            this.config.file.select_files.forEach((item:AnyObject)=>{
                file_id.push(item.id)
            })

            this.emit('delFile', {
                select_file_id: file_id.join(','),
                loadFile: () => {
                    this.emit('loadFile', this.config.file)
                }
            })
        }).catch(() => {
            console.log('delete cancel')
        })
    }

    /**
     * 编辑文件
     * @param fileObj
     */
    editFile = (fileObj:AnyObject):void => {
        this.config.file.current_input_file = fileObj
    }

    /**
     * 保存文件
     */
    saveFile = ():void => {
        this.emit('saveFile',this.config.file.current_input_file)
        this.config.file.current_input_file = null
    }

    /**
     * 上传文件成功回调
     * @param response
     * @param uploadFile
     * @param uploadFiles
     */
    onUploadSuccess = (response: AnyObject, uploadFile: UploadFile, uploadFiles: UploadFiles):void => {
        this.emit('onUploadSuccess',{response:response, uploadFile: uploadFile, uploadFiles: uploadFiles})
    }

    /**
     * 上传文件失败回调
     * @param error
     * @param uploadFile
     * @param uploadFiles
     */
    onUploadError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles):void => {
        this.emit('onUploadError',{error: error, uploadFile: uploadFile, uploadFiles: uploadFiles})
    }

    /**
     * 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
     * @param rawFile
     */
    beforeUpload = (rawFile: UploadRawFile):void => {
        this.emit('beforeUpload', rawFile)
    }

}
