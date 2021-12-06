<template>
  <!-- 登录 -->
  <el-form
    :model="registerUser"
    :rules="rules"
    ref="registerForm"
    class="registerForm sign-up-form"
    label-width="80px"
  >
    <el-form-item label="用户名" prop="name">
      <el-input
        v-model="registerUser.name"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="registerUser.email"
        placeholder="请输入邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="registerUser.password"
        placeholder="请输入密码"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input
        v-model="registerUser.password2"
        placeholder="请输入确认密码"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item label="选择身份">
      <el-select v-model="registerUser.role" placeholder="请选择身份">
        <el-option label="管理员" value="admin"></el-option>
        <el-option label="用户" value="user"></el-option>
        <el-option label="游客" value="visitor"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup () {
    const registerUser = ref({
      name: '',
      email: '',
      password: '',
      password2: '',
      role: ''
    })

    const rules = ref({
      name: [
        {
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }
      ],
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
      ],
      password2: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value) return callback(new Error('确认密码不能为空'))

            if (ctx.registerUser.password !== value) {
              return callback(new Error('两次输入密码不一致'))
            }

            callback()
          },
          trigger: 'blur'
        }
      ]
    })

    // 获取当前组件实例
    const { ctx } = getCurrentInstance()

    const router = useRouter()

    const register = () => {
      ctx.$refs.registerForm.validate(async valid => {
        if (!valid) return

        await ctx.$axios.post('/api/v1/auth/register', registerUser.value)

        ctx.$message.success('注册成功~')

        // 路由跳转
        router.push('/home')
      })
    }

    return {
      registerUser,
      rules,
      register
    }
  }
}
</script>

<style scoped>
/* form */
.registerForm {
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
