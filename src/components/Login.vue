<template>
  <div id="login">
    <div id="bgd">
      <el-alert center show-icon title="10月18号之前已注册的账户在登陆时,可能会出现密码错误的情况,在此情况下尝试使用初始密码(用户名+123456)进行登录" type="warning alert" effect="dark" />
      <canvas id="myCanvas" :width="width" :height="height"> </canvas>
    </div>
    <div v-if="status == 1" id="loginBox">
      <h4>SIMBLOCKCHAIN</h4>
      <el-form label-width="0px" :model="state.formLabelAlign">
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
                placeholder="用户ID"
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
                @keyup.enter="login"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item style="margin-top: 55px">
          <el-button
            type="primary"
            round
            class="submitBtn"
            :loading="state.loginLoading"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <div class="regist">
            <span style="cursor: pointer" @click="toRegist">注册</span>
          </div>
          <div class="forget">
            <span style="cursor: pointer" @click="forgetPas">忘记密码</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-else-if="status == 2" id="registBox">
      <h4>用户注册</h4>
      <el-form label-width="0px" :model="state.formLabelAlign">
        <el-form-item label="" prop="authName" style="margin-top: 30px">
          <el-row>
            <el-col :span="2">
              <el-icon :size="18" class="iconfont">
                <User />
              </el-icon>
            </el-col>
            <el-col :span="22">
              <el-input
                class="inps"
                placeholder="用户名(学号)"
                v-model="registState.formLabelAlign.authname"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" prop="userName">
          <el-row>
            <el-col :span="2">
              <el-icon :size="18" class="iconfont">
                <Postcard />
              </el-icon>
            </el-col>
            <el-col :span="22">
              <el-input
                class="inps"
                placeholder="用户ID(英文或英文数字组合)"
                v-model="registState.formLabelAlign.username"
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
              <el-popover placement="right" :width="400" trigger="click">
                <template #reference>
                  <el-input
                    class="inps"
                    placeholder="密码"
                    v-model="registState.formLabelAlign.password"
                    :type="registState.passwordType"
                    show-password
                  ></el-input>
                </template>
                <div style="content-box">
                  <div class="content-box">
                    <el-icon :size="18" class="iconfontRemove">
                      <Remove /> </el-icon
                    ><span style="padding-left: 5px"
                      >6-20个字符,密码不能是相同的用户名</span
                    >
                  </div>
                  <div class="content-box">
                    <el-icon :size="18" class="iconfontRemove">
                      <Remove /> </el-icon
                    ><span style="padding-left: 5px"
                      >只能包含字母、数字以及标点符号(除空格)</span
                    >
                  </div>
                  <div class="content-box">
                    <el-icon :size="18" class="iconfontRemove">
                      <Remove /> </el-icon
                    ><span style="padding-left: 5px"
                      >字母、数字和标点符号至少包含2种</span
                    >
                  </div>
                </div>
              </el-popover>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="" prop="Phone">
          <el-row>
            <el-col :span="2">
              <el-icon :size="18" class="iconfont">
                <Phone />
              </el-icon>
            </el-col>
            <el-col :span="22">
              <el-input
                class="inps"
                placeholder="手机号"
                v-model="registState.formLabelAlign.phone"
                :type="registState.phoneType"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top: 45px">
          <el-button
            type="primary"
            round
            class="submitBtn"
            :loading="registState.loginLoading"
            @click="regist"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <div class="regist" @click="backLogin">返回</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="bottomRec">
    MayCopyright © 2022 || 推荐PC端使用(Google Chrome/Microsoft Edge)
  </div>
</template>

<script>
import { User, Edit, Phone, Remove, Postcard } from "@element-plus/icons";
import { onMounted, reactive, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { getDate } from "../utils/utils";
import { useRouter } from "vue-router";
import { getLoginMes, registerUser } from "../api/apis";
import { ElMessageBox, ElMessage } from "element-plus";
import { judgePhone, judgePassWord } from "../utils/utils";
import { insertToVisitor } from "../api/apis.js";

export default {
  components: {
    User,
    Edit,
    Phone,
    Remove,
    Postcard,
  },
  data() {
    const status = ref(1); //状态，1为登录，2为注册，3为忘记密码，4为忘记密码之后重置密码

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
        authname: "",
        username: "",
        password: "",
        phone: "",
      },
      passwordType: "password",
      phoneType: "Phone",
    });

    const registState = reactive({
      count: 0,
      loginLoading: false,
      localTime: getDate(),
      labelPosition: "right",
      formLabelAlign: {
        authname: "",
        username: "",
        password: "",
        phone: "",
      },
      passwordType: "password",
      phoneType: "Phone",
    });

    const { t } = useI18n();

    function changeType() {
      state.passwordType =
        state.passwordType == "password" ? "text" : "password";
    }

    function regist() {
      let params = registState.formLabelAlign;
      if (params.username != "" || params.password != "") {
        if (judgePhone(params.phone)) {
          let passWordjs = judgePassWord(params);
          if (passWordjs.state == 0) {
            let chain = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
            let endss = chain.test(params.username);
            if (!endss) {
              registerUser({
                authname: params.authname,
                username: params.username,
                password: params.password,
                phone: params.phone,
              }).then((res) => {
                if (res.status == 1) {
                  ElMessage({
                    message: "用户注册成功！",
                    type: "success",
                  });
                  status.value = 1;
                } else {
                  ElMessage({
                    message: res.msg,
                    type: "warning",
                  });
                }
              });
            } else {
              ElMessageBox.alert("用户ID标准错误!", "WARING", {
              confirmButtonText: "OK",
            });
            }
          } else {
            ElMessageBox.alert(passWordjs.mes, "WARING", {
              confirmButtonText: "OK",
            });
          }
        } else {
          ElMessageBox.alert("请输入正确的手机号！", "WARING", {
            confirmButtonText: "OK",
          });
        }
      } else {
        ElMessageBox.alert("请输入账号密码！", "WARING", {
          confirmButtonText: "OK",
        });
      }
    }

    function toRegist() {
      status.value = 2;
    }

    function forgetPas() {
      ElMessageBox.alert("忘记密码请联系管理员！", "WARING", {
        confirmButtonText: "OK",
      });
    }
    function backLogin() {
      status.value = 1;
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
      if (params.username == "" || params.password == "") {
        ElMessageBox.alert("请输入账户名或密码！", "WARING", {
          confirmButtonText: "OK",
        });
      } else {
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
            // console.log("store", store);
            store
              .dispatch("asyncGetRoutes", res.data.username)
              .then((path) => {
                //小于1100时设置为不可访问
                let screenWidth = document.body.clientWidth;
                let minSize = 1200;
                if (screenWidth < minSize) {
                  router.push("/needUserPc");
                } else {
                  // console.log("path", path);
                  state.loginLoading = false;
                  router.push("/layout/" + path[0].path);
                }
              })
              .catch(() => {
                // console.log("store2", store);
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
        // console.log(params);
      }
      // JSON.parse(JSON.stringify(state.formLabelAlign));
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
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      router,
      store,
      isPhone,
      state,
      changeType,
      login,
      status,
      backLogin,
      toRegist,
      forgetPas,
      registState,
    };
  },
  methods: {
    //提交登录
  },
  mounted() {
    insertToVisitor(null);
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");
  },
};
</script>

<style lang="less" scoped>
.regist {
  position: absolute;
  width: 50%;
  font-size: 12px;
  color: #409eff;
}

.forget {
  position: absolute;
  margin-left: 45%;
  width: 50%;
  font-size: 12px;

  color: #409eff;
}
#login {
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 96vh;
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
    background-image: url(../assets/blockchain.png);
    background-repeat: no-repeat;
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
    background: linear-gradient(
      230deg,
      rgba(53, 57, 74, 0) 0%,
      rgb(0, 0, 0) 100%
    );
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
  #registBox {
    width: 240px;
    height: 400px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(
      230deg,
      rgba(53, 57, 74, 0) 0%,
      rgb(0, 0, 0) 100%
    );
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
.bottomRec {
  color: rgb(73, 73, 73);
  height: 4vh;
  background-color: rgb(120, 147, 173);
  font-size: 12px;
  line-height: 27px;
  text-align: center;
}
.content-box {
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  white-space: nowrap;
}
.iconfontRemove {
  vertical-align: -10%;
  color: rgb(255, 140, 0);
}
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
