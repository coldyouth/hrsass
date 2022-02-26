<template>
  <div>
    <el-upload
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="upload"
      list-type="picture-card"
      action="#"
      :limit="1"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt />
    </el-dialog>
    <el-progress v-if="showPercent" :text-inside="true" :stroke-width="13" :percentage="percent" />
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDrXx6yavzmJZYGislNinb8OO7YicGciY8',
  SecretKey: 'LPCibEagW4LL7cqmTs0sUptgCSQ7XgY9'
})
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '', // 弹窗图片地址
      currentFileUid: 0, // 要上传的图片的uid
      showPercent: false, // 是否显示进度条
      percent: 0 // 进度条百分比
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      console.log('cg', file)
      console.log('cgls', fileList)
      this.fileList = fileList.map((item) => item)
    },
    // 上传之前检查
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload(params) {
      // var that = this
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        cos.putObject(
          {
            Bucket: 'coldyouth-1309826235', // 存储桶
            Region: 'ap-guangzhou', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 进度条
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            if (!err && data.statusCode === 200) {
              console.log('上传成功', this)
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  return { url: 'http://' + data.Location, upload: true }
                }
                return item
              })
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)
            }
          }
        )
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

