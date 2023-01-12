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
主界面添加用户登录状态判断✔


### 5
单流程仿真清除数据之后网络仿真状态恢复✔


### 6
网络仿真策略修改后直接关闭界面未恢复原样✔


### 7 
地域的可手动配置✔


### 8
队列存储堆栈的形式来进行事务驱动✔

### 9
全流程仿真区块创建交易合并✔

### 10
全流程仿真utxo存在负数*(✔)


### 11
线条仿真结束时存在仿真线条闪退问题✔


### 12
全流程信息搜索功能✔

### 13✔
全流程时间机制的优化设计，当使用包含流程线性创建时，可以对所有时间进行优化创建，及事务的实际发生时间发生改变，虚拟发生时间不边，（仅优化wholesim页面的3065与3101）

### 14✔
用户密码注册强口令限制的增加

### 15中文账户问题✔
账户名称与账户ID分开

### 16区块创建请求超时 ✔
修改了后端数据循环问题，限制数据处理时间（10s）

### 17全流程请求数据过大(非管理员账户区块创建失败:同16) 
Error parsing HTTP request header
 Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level
 https://www.jianshu.com/p/5577ae4615d8


### 18 Index 1 out of bounds for length 1✔
 at com.simblockchain.Utils.IpUtils.getStringData(IpUtils.java:22) ~[classes!/:0.9.3]
        at com.simblockchain.service.impl.LogMesDataServiceImpl.insertLogMesVisitor(LogMesDataServiceImpl.java:43) ~[classes!/:0.9.3]
        at com.simblockchain.controller.LogMesDataController.insertToVisitor(LogMesDataController.java:29) ~[classes!/:0.9.3]

### 19 query did not return a unique result: 2✔
 at com.simblockchain.service.impl.SingleP2PNetServiceImpl.createNewP2pNet(SingleP2PNetServiceImpl.java:53) ~[classes!/:0.9.3]
        at com.simblockchain.controller.SingleP2PNetController.addNewP2pNet(SingleP2PNetController.java:44) ~[classes!/:0.9.3]
		Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.dao.IncorrectResultSizeDataAccessException: query did not return a unique result: 2; nested exception is javax.persistence.NonUniqueResultException: query did not return a unique result: 2] with root cause

### 20 Index 0 out of bounds for length 0] with root cause✔
r servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0] with root cause

java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        at com.simblockchain.service.impl.LogMesDataServiceImpl.insertLogMesVisitor(LogMesDataServiceImpl.java:61) ~[classes!/:0.9.3]
        at com.simblockchain.controller.LogMesDataController.insertToVisitor(LogMesDataController.java:29) ~[classes!/:0.9.3]
    
### 21 Connection initialization timed out. Command timed out after 100 second(s)🐕✔
        at io.lettuce.core.internal.ExceptionFactory.createTimeoutException(ExceptionFactory.java:65) ~[lettuce-core-6.1.5.RELEASE.jar!/:6.1.5.RELEASE]
        at io.lettuce.core.protocol.RedisHandshakeHandler.lambda$channelRegistered$0(RedisHandshakeHandler.java:62) ~[lettuce-core-6.1.5.RELEASE.jar!/:6.1.5.RELEASE]
        at io.netty.util.concurrent.PromiseTask.runTask(PromiseTask.java:98) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at io.netty.util.concurrent.PromiseTask.run(PromiseTask.java:106) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at io.netty.util.concurrent.DefaultEventExecutor.run(DefaultEventExecutor.java:66) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:986) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30) ~[netty-common-4.1.70.Final.jar!/:4.1.70.Final]
        at java.base/java.lang.Thread.run(Thread.java:834) ~[na:na]