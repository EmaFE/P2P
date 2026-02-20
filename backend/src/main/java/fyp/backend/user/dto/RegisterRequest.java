package fyp.backend.user.dto;

import java.util.UUID;

import jakarta.validation.constraints.*;;

public class RegisterRequest {

  @NotEmpty
  private UUID userId;

  @NotEmpty
  private String username;

  @NotEmpty
  private String email;

  @NotEmpty
  private String password;

    //getters
  public UUID getUserId(){
    return userId;
  }
  public String getUsername(){
    return username;
  }
  public String getEmail(){
    return email;
  }
  public String getPassword(){
    return password;
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
  public void setPassword(String password) {
    this.password = password;
  }

  
}
