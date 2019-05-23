<template>
  <div class="login">
    <i-card style="width:350px; margin: 100px auto;" dis-hover>
      <h3 slot="title">登录</h3>
      <i-form ref="form" :model="user" :rules="rules">
        <i-form-item prop="email" label="用户名：">
          <i-input
            v-model="user.username"
            type="text"
            aria-placeholder="请输入用户名"
            aria-setsize="large"
          ></i-input>
        </i-form-item>
        <i-form-item prop="password" label="密码：">
          <i-input
            v-model="user.password"
            type="password"
            placeholder="请输入密码"
            aria-setsize="large"
          ></i-input>
        </i-form-item>
        <i-form-item prop="email" label="邮箱：">
          <i-input
            v-model="user.email"
            type="text"
            aria-placeholder="请输入邮箱"
            aria-setsize="large"
          ></i-input>
        </i-form-item>
        <i-form-item prop="code" label="验证码：">
          <i-input v-model="user.code" aria-placeholder="请输入验证码">
            <p slot="append">
              <img :src="codeSrc" alt="code" @click="handleCode" />
            </p>
          </i-input>
        </i-form-item>
        <i-form-item>
          <Button type="primary" style="margin-top: 20px" long @click="login"
            >登录</Button
          >
        </i-form-item>
      </i-form>
    </i-card>
  </div>
</template>
<script>
import { verifyPassword, verifyEmail } from '~/assets/libs/validate'

export default {
  name: 'BaseLogin',
  layout: 'base',
  data() {
    return {
      codeSrc: '/api/code',
      user: {
        username: '',
        email: '',
        password: '',
        code: ''
      },
      rules: {
        password: verifyPassword(),
        email: verifyEmail(),
        code: {
          required: true,
          min: 4,
          trigger: 'blur',
          message: '请正确输入验证码'
        }
      }
    }
  },
  methods: {
    login() {
      this.$ref.form.validate(async valid => {
        if (valid) {
          await this.login(this.user)
          this.$router.push('/admin/posts')
        }
      })
    },
    handleCode() {
      this.codeSrc = `${this.codeSrc}?v=${Date.now()}`
    }
  }
}
</script>
<style lang="less">
.login {
  .ivu-input-group-append {
    padding: 0 !important;
    img {
      display: block;
      width: 80px;
      height: 38px;
    }
  }
  .ivu-input-large {
    height: 40px;
  }
}
</style>
