<template>
  <div id="login">
    <div id="bgd">
      <canvas id="myCanvas" :width="width" :height="height"> </canvas>
    </div>
    <div id="loginBox">
      <h4>SIMBLOCKCHAIN</h4>
      <el-form  label-width="0px" :model="state.formLabelAlign">
        <el-form-item label="" prop="userName" style="margin-top: 40px">
          <el-row>
            <el-col :span="2">
              <el-icon :size="18" class="iconfont">
                <User />
              </el-icon>
            </el-col>
            <el-col :span="22">
              <el-input
                class="inps"
                placeholder="用户名"
                v-model="state.formLabelAlign.username"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" prop="passWord">
          <el-row>
            <el-col :span="2">
              <el-icon :size="18" class="iconfont">
                <Edit />
              </el-icon>
            </el-col>
            <el-col :span="22">
              <el-input
                class="inps"
                placeholder="密码"
                v-model="state.formLabelAlign.password"
                :type="state.passwordType"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top: 55px">
          <el-button type="primary" round class="submitBtn" 
          :loading="state.loginLoading"
          @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item label="">
            <div class="regist" @click="regist">注册</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script >
import { User, Edit } from "@element-plus/icons";
import { onMounted, reactive, computed,ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { getDate } from "../utils/utils";
import { useRouter } from "vue-router";
import { getLoginMes } from "../api/apis";
import { ElMessageBox } from "element-plus";

export default {
  components: {
    User,
    Edit,
  },
  data() {
    const status = ref(1);//状态，1为登录，2为注册，3为忘记密码，4为忘记密码之后重置密码

    const router = useRouter();
    const store = useStore();

    const isPhone = computed(() => {
      return store.getters.getIsPhone;
    });

    const state = reactive({
      count: 0,
      loginLoading: false,
      localTime: getDate(),
      labelPosition: "right",
      formLabelAlign: {
        username: "",
        password: "",
      },
      passwordType: "password",
    });

    const { t } = useI18n();

    function changeType() {
      state.passwordType = state.passwordType == "password" ? "text" : "password";
    }

    function regist() {
      ElMessageBox.alert("功能未开放！", "WARING", {
            confirmButtonText: "OK",
          });
    }
    // function getLoginMesss(){
    //   const params = {
    //     "username": "admin",
    //     "password": "111111"
    //     }
    //   getLoginMes(params).then((res) =>{
    //     console.log("获取数据:");
    //     console.log(res);
    //   });
    // }
    function login() {
      const params = JSON.parse(JSON.stringify(state.formLabelAlign));

      // JSON.parse(JSON.stringify(state.formLabelAlign));
      state.loginLoading = true;
      const res = {
        status: 1,
        msg: "登录成功",
        data: {
          _id: "60405311da60180001956279",
          password: "111111",
          username: "admin1",
          auth: "admin1",
          create_date: "2022/3/23",
          delete_date: "0",
        },
      };
      getLoginMes(params).then((res) => {
        if (res.status === 1) {
          store.commit("getUser", { token: res.data._id, ...res.data });
          console.log("store", store);
          store
            .dispatch("asyncGetRoutes", res.data.auth)
            .then((path) => {
              console.log("path", path);
              state.loginLoading = false;
              router.push("/layout/" + path[0].path);
            })
            .catch(() => {
              console.log("store2", store);
              state.loginLoading = false;
            });
          // console.log(store.dispatch('asyncGetRoutes'))
        } else {
          state.loginLoading = false;
          ElMessageBox.alert(res.msg, "WARING", {
            confirmButtonText: "OK",
          });
        }
      });
      console.log(params);
    }
    return {
      canvas: null,
      context: null,
      stars: [], //星星数组
      shadowColorList: [
        "#39f",
        "#ec5707",
        "#b031d4",
        "#22e6c7",
        "#92d819",
        "#14d7f1",
        "#e23c66",
      ], //阴影颜色列表
      directionList: ["leftTop", "leftBottom", "rightTop", "rightBottom"], //星星运行方向
      speed: 50, //星星运行速度
      last_star_created_time: new Date(), //上次重绘星星时间
      Ball: class Ball {
        constructor(radius) {
          this.x = 0;
          this.y = 0;
          this.radius = radius;
          this.color = "";
          this.shadowColor = "";
          this.direction = "";
        }

        draw(context) {
          context.save();
          context.translate(this.x, this.y);
          context.lineWidth = this.lineWidth;
          var my_gradient = context.createLinearGradient(0, 0, 0, 8);
          my_gradient.addColorStop(0, this.color);
          my_gradient.addColorStop(1, this.shadowColor);
          context.fillStyle = my_gradient;
          context.beginPath();
          context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
          context.closePath();
          context.shadowColor = this.shadowColor;
          context.shadowOffsetX = 0;
          context.shadowOffsetY = 0;
          context.shadowBlur = 10;

          context.fill();
          context.restore();
        }
      }, //工厂模式定义Ball类
      regist,
      height: window.innerHeight,
      loginForm: {
        userName: "",
        passWord: "",
      },
      loginRules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      router,store,isPhone,state,changeType,login
    };
  },
  methods: {
    //提交登录
    submitForm() {},
  },
  mounted() {
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");
  },
};
</script>

<style lang="less" scoped>
.regist {
        font-size: 12px;
        cursor: pointer;
        color: #409eff;
      }
#login {
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: left top;
  background-color: #242645;
  color: #fff;
  font-family: "Source Sans Pro";
  background-size: 100%;
  background-color: rgb(120, 147, 173);
  position: relative;
  #bgd {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  #loginBox {
    width: 240px;
    height: 280px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
    .inps input {
      border: none;
      color: #fff;
      background-color: transparent;
      font-size: 12px;
    }
    .submitBtn {
      background-color: transparent;
      color: #39f;
      width: 200px;
    }
    .iconfont {
      color: #fff;
      top: 5px;
      right: 10px;
    }
  }
}
</style>
