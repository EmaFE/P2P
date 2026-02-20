error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/User.java:_empty_/NoArgsConstructor#
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/User.java
empty definition using pc, found symbol in pc: _empty_/NoArgsConstructor#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 299
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/User.java
text:
```scala
package fyp.backend.user;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@@@NoArgsConstructor
@AllArgsConstructor

public class User {
  @Id
  @GeneratedValue
  private UUID userId;

  @Column(unique = true, nullable = false)
  private String username;
  
  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String role;

  private String passwordHash;

  public User(){

  }

  //getters and setters
  public UUID getUserId(){
    return userId;
  }
  public String getUsername(){
    return username;
  }
  public String getEmail(){
    return email;
  }
  public String getRole(){
    return role;
  }
  public void setUserId(UUID userId) {
    this.userId = userId;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }
  public void setRole(String role){
    this.role = role;
  }
  
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/NoArgsConstructor#