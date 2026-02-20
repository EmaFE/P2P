package fyp.backend.user;

import java.util.UUID;

import lombok.Data;

@Data
public class UserDTO {

  private UUID userId;
  private String username;
  private String email;
  private String role;
  private String password; //used only when creating a user

  public static UserDTO fromEntity(User user) {
    UserDTO dto = new UserDTO();
    dto.setUserId(user.getUserId());
    dto.setEmail(user.getEmail());
    dto.setUsername(user.getUsername());
    dto.setRole(user.getRole());
    return dto;
  }
  
}
