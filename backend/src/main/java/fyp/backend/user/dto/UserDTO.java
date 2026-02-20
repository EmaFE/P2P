package fyp.backend.user.dto;
import fyp.backend.user.User;

public class UserDTO {

  private String username;
  private String email;
  private String role;

  public UserDTO(User user) {
    this.username = user.getUsername();
    this.email = user.getEmail();
    this.role = user.getRole();
  }


  //getters and setters
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public String getRole() {
    return role;
  }
  public void setRole(String role) {
    this.role = role;
  }  
}