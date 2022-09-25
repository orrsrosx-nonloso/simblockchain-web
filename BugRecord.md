## bug record
### 1
Data：2022/7/16

Event: When we create an account under the node, the new account will be automatically allocated under the change node.

close;

### 2 
Data：2022/7/16
event:after created new empty account,you create new account will have the  following exception
    java.lang.NullPointerException: null
	at com.simblockchain.Utils.AccountMesUtils.getMinerAcount(AccountMesUtils.java:12) ~[classes/:na]
	at com.simblockchain.controller.SingleBlockController.createBlock(SingleBlockController.java:79) ~[classes/:na]
	at com.simblockchain.controller.SingleBlockController$$FastClassBySpringCGLIB$$458484df.invoke(<generated>) ~[classes/:na]

### 3
Data：2022/7/18
java.lang.NullPointerException: null
	at com.simblockchain.service.impl.UserServiceImpl.checkUserStatus(UserServiceImpl.java:56) ~[classes/:na]
	at com.simblockchain.controller.SingleNodeController.isExistCache(SingleNodeController.java:279) ~[classes/:na]


### 4
主界面添加用户登录状态判断


### 5
单流程仿真清除数据之后网络仿真状态恢复


### 6
网络仿真策略修改后直接关闭界面未恢复原样


### 7 
地域的可手动配置✔


### 8
队列存储堆栈的形式来进行事务驱动✔

### 9
全流程仿真区块创建交易合并✔

### 9
全流程仿真utxo存在负数*(✔)


### 9
线条仿真结束时存在仿真线条闪退问题✔


### 9
全流程信息搜索功能✔

###10
全流程时间机制的优化设计，当使用包含流程线性创建时，可以对所有时间进行优化创建，及事务的实际发生时间发生改变，虚拟发生时间不边，（仅优化wholesim页面的3065与3101）