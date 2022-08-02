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
地域的可手动配置


### 8
队列存储堆栈的形式来进行事务驱动
