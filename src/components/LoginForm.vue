<template>
  <!-- 登录 -->
  <el-form
    :model="loginUser"
    :rules="rules"
    ref="loginForm"
    class="loginForm  sign-in-form"
    label-width="80px"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="loginUser.password"
        placeholder="请输入密码"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form-item>
    <div class="tiparea">
      <p>忘记密码？<a>立即找回</a></p>
    </div>
  </el-form>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup () {
    const loginUser = ref({
      email: '',
      password: ''
    })

    const rules = ref({
      email: [
        {
          required: true,
          type: 'email',
          message: '邮箱不合法',
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 16,
          message: '密码长度6-16位之间',
          trigger: 'blur'
        }
      ]
    })

    // 获取当前组件实例
    const { ctx } = getCurrentInstance()
    const router = useRouter()

    const login = () => {
      ctx.$refs.loginForm.validate(async valid => {
        if (!valid) return

        const res = await ctx.$axios.post('/api/v1/auth/login', loginUser.value)

        ctx.$message.success('登录成功~')

        // 保存token
        const { token } = res.data
        localStorage.setItem('vue3-element-plus-demo-token', token)

        // 路由跳转
        router.push('/home')
      })
    }

    return {
      loginUser,
      rules,
      login
    }
  }
}
</script>

<style scoped>
/* form */
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>
