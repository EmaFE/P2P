error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserMapper.java
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserMapper.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[27,1]

error in qdox parser
file content:
```java
offset: 694
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserMapper.java
text:
```scala
// package fyp.backend.user.dto;

// import org.hibernate.validator.constraints.UUID;

// import fyp.backend.user.*;

// public class UserMapper {

//   public UserDTO toDTO(User user){
//     String username = user.getUsername();
//     String email = user.getEmail();
//     String role = user.getRole();

//     return new UserDTO(username, email, role);
//   }

//   public User toUser (UserCreationDTO userDTO){
//     String username = userDTO.getUsername();
//     String email = userDTO.getEmail();
//     String password = userDTO.getPassword();
//     String role = userDTO.getRole();

//     return new User(username, email, password, role);
//   }
  
// }
@@
```

```



#### Error stacktrace:

```
com.thoughtworks.qdox.parser.impl.Parser.yyerror(Parser.java:2025)
	com.thoughtworks.qdox.parser.impl.Parser.yyparse(Parser.java:2147)
	com.thoughtworks.qdox.parser.impl.Parser.parse(Parser.java:2006)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:232)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:190)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:94)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:89)
	com.thoughtworks.qdox.library.SortedClassLibraryBuilder.addSource(SortedClassLibraryBuilder.java:162)
	com.thoughtworks.qdox.JavaProjectBuilder.addSource(JavaProjectBuilder.java:174)
	scala.meta.internal.mtags.JavaMtags.indexRoot(JavaMtags.scala:49)
	scala.meta.internal.metals.SemanticdbDefinition$.foreachWithReturnMtags(SemanticdbDefinition.scala:99)
	scala.meta.internal.metals.Indexer.indexSourceFile(Indexer.scala:560)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3(Indexer.scala:691)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3$adapted(Indexer.scala:688)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterator.foreach(Iterator.scala:1313)
	scala.meta.internal.metals.Indexer.reindexWorkspaceSources(Indexer.scala:688)
	scala.meta.internal.metals.MetalsLspService.$anonfun$onChange$2(MetalsLspService.scala:936)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.concurrent.Future$.$anonfun$apply$1(Future.scala:691)
	scala.concurrent.impl.Promise$Transformation.run(Promise.scala:500)
	java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
	java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
	java.base/java.lang.Thread.run(Thread.java:840)
```
#### Short summary: 

QDox parse error in file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserMapper.java