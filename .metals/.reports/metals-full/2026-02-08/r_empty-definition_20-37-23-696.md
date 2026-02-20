error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserRepository.java:_empty_/User#
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserRepository.java
empty definition using pc, found symbol in pc: _empty_/User#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 202
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserRepository.java
text:
```scala
package fyp.backend.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<@@User, UUID>{
  Optional<User> findByEmail(String email);  
} 

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/User#