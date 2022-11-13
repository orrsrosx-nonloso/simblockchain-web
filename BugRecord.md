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

### 16区块创建请求超时 ✔暂时处理
修改了后端数据循环问题，限制数据处理时间（10s）

### 17全流程请求数据过大(非管理员账户区块创建失败:同16) 
Error parsing HTTP request header
 Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level
 https://www.jianshu.com/p/5577ae4615d8


### 18 Index 1 out of bounds for length 1
 at com.simblockchain.Utils.IpUtils.getStringData(IpUtils.java:22) ~[classes!/:0.9.3]
        at com.simblockchain.service.impl.LogMesDataServiceImpl.insertLogMesVisitor(LogMesDataServiceImpl.java:43) ~[classes!/:0.9.3]
        at com.simblockchain.controller.LogMesDataController.insertToVisitor(LogMesDataController.java:29) ~[classes!/:0.9.3]

### 19 query did not return a unique result: 2
 at com.simblockchain.service.impl.SingleP2PNetServiceImpl.createNewP2pNet(SingleP2PNetServiceImpl.java:53) ~[classes!/:0.9.3]
        at com.simblockchain.controller.SingleP2PNetController.addNewP2pNet(SingleP2PNetController.java:44) ~[classes!/:0.9.3]



		Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.dao.IncorrectResultSizeDataAccessException: query did not return a unique result: 2; nested exception is javax.persistence.NonUniqueResultException: query did not return a unique result: 2] with root cause


		javax.persistence.NonUniqueResultException: query did not return a unique result: 2
        at org.hibernate.internal.ExceptionConverterImpl.convert(ExceptionConverterImpl.java:128) ~[hibernate-core-5.6.1.Final.jar!/:5.6.1.Final]
        at org.hibernate.query.internal.AbstractProducedQuery.getSingleResult(AbstractProducedQuery.java:1672) ~[hibernate-core-5.6.1.Final.jar!/:5.6.1.Final]
        at jdk.internal.reflect.GeneratedMethodAccessor129.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Method.java:566) ~[na:na]
        at org.springframework.orm.jpa.SharedEntityManagerCreator$DeferredQueryInvocationHandler.invoke(SharedEntityManagerCreator.java:406) ~[spring-orm-5.3.13.jar!/:5.3.13]
        at com.sun.proxy.$Proxy144.getSingleResult(Unknown Source) ~[na:na]
        at org.springframework.data.jpa.repository.query.JpaQueryExecution$SingleEntityExecution.doExecute(JpaQueryExecution.java:198) ~[spring-data-jpa-2.6.0.jar!/:2.6.0]
        at org.springframework.data.jpa.repository.query.JpaQueryExecution.execute(JpaQueryExecution.java:90) ~[spring-data-jpa-2.6.0.jar!/:2.6.0]
        at org.springframework.data.jpa.repository.query.AbstractJpaQuery.doExecute(AbstractJpaQuery.java:155) ~[spring-data-jpa-2.6.0.jar!/:2.6.0]
        at org.springframework.data.jpa.repository.query.AbstractJpaQuery.execute(AbstractJpaQuery.java:143) ~[spring-data-jpa-2.6.0.jar!/:2.6.0]
        at org.springframework.data.repository.core.support.RepositoryMethodInvoker.doInvoke(RepositoryMethodInvoker.java:137) ~[spring-data-commons-2.6.0.jar!/:2.6.0]
        at org.springframework.data.repository.core.support.RepositoryMethodInvoker.invoke(RepositoryMethodInvoker.java:121) ~[spring-data-commons-2.6.0.jar!/:2.6.0]
        at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.doInvoke(QueryExecutorMethodInterceptor.java:159) ~[spring-data-commons-2.6.0.jar!/:2.6.0]
        at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.invoke(QueryExecutorMethodInterceptor.java:138) ~[spring-data-commons-2.6.0.jar!/:2.6.0]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.data.projection.DefaultMethodInvokingMethodInterceptor.invoke(DefaultMethodInvokingMethodInterceptor.java:80) ~[spring-data-commons-2.6.0.jar!/:2.6.0]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:123) ~[spring-tx-5.3.13.jar!/:5.3.13]
        at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:388) ~[spring-tx-5.3.13.jar!/:5.3.13]
        at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:119) ~[spring-tx-5.3.13.jar!/:5.3.13]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.dao.support.PersistenceExceptionTranslationInterceptor.invoke(PersistenceExceptionTranslationInterceptor.java:137) ~[spring-tx-5.3.13.jar!/:5.3.13]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.data.jpa.repository.support.CrudMethodMetadataPostProcessor$CrudMethodMetadataPopulatingMethodInterceptor.invoke(CrudMethodMetadataPostProcessor.java:145) ~[spring-data-jpa-2.6.0.jar!/:2.6.0]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:215) ~[spring-aop-5.3.13.jar!/:5.3.13]
        at com.sun.proxy.$Proxy105.findByDataAndAgent(Unknown Source) ~[na:na]
        at com.simblockchain.service.impl.LogMesDataServiceImpl.insertLogMesSimNum(LogMesDataServiceImpl.java:80) ~[classes!/:0.9.3]
        at com.simblockchain.controller.SingleNodeController.createNode(SingleNodeController.java:97) ~[classes!/:0.9.3]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Method.java:566) ~[na:na]
        at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1067) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:963) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:909) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:681) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883) ~[spring-webmvc-5.3.13.jar!/:5.3.13]
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:764) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53) ~[tomcat-embed-websocket-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119) ~[spring-web-5.3.13.jar!/:5.3.13]
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:540) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:357) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:382) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:895) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1722) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) ~[tomcat-embed-core-9.0.55.jar!/:na]
        at java.base/java.lang.Thread.run(Thread.java:834) ~[na:na]
