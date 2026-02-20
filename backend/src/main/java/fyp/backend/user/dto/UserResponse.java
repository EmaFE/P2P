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
  public String username(){
    return username;
  }
  public String getEmail(){
    return email;
  }

}
