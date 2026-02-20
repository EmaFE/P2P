error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserResponse.java:java/lang/String#
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserResponse.java
empty definition using pc, found symbol in pc: java/lang/String#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 507
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserResponse.java
text:
```scala
package fyp.backend.user.dto;

import java.util.UUID;

import fyp.backend.user.User;

public class UserResponse {
  
  private UUID userId;
  private String username;
  private String email;

  public static UserResponse from(User user){
    UserResponse dto = new UserResponse();
    dto.userId = user.getUserId();
    dto.username = user.getUsername();
    dto.email = user.getEmail();
    return dto;
  }

  //getters
  public UUID getUserId(){
    return userId;
  }
  public Str@@ing username(){
    return username;
  }
  public String getEmail(){
    return email;
  }

}

```


#### Short summary: 

empty definition using pc, found symbol in pc: java/lang/String#