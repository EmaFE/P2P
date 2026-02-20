error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserResponse.java:
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/dto/UserResponse.java
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 455
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
  public UUID@@ getUserId(){
    return userId;
  }
  public String username(){
    return username;
  }
  public String getEmail(){
    return email;
  }

}

```


#### Short summary: 

empty definition using pc, found symbol in pc: 