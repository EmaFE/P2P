error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[50,1]

error in qdox parser
file content:
```java
offset: 1471
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java
text:
```scala
// package fyp.backend.user;

// import java.util.UUID;

// import org.apache.coyote.BadRequestException;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import fyp.backend.user.dto.RegisterRequest;

// @Service
// public class UserService {

//   @Autowired
//   private UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//   public UserService(
//       UserRepository userRepository,
//       PasswordEncoder passwordEncoder
//   ) {
//     this.userRepository = userRepository;
//     this.passwordEncoder = passwordEncoder;
//   }

//   public User register(RegisterRequest request) {

//     if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//       throw new BadRequestException("Email already in use");
//     }

//     User user = new User();
//     user.setUsername(request.getUsername());
//     user.setEmail(request.getEmail());
//     user.setPasswordHash(
//         passwordEncoder.encode(request.getPassword())
//     );

//     return userRepository.save(user);
//   }

//   public User getById(UUID id) {
//     return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
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

QDox parse error in file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java