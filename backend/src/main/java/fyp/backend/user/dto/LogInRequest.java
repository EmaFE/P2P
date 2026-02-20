package fyp.backend.user.dto;

import jakarta.validation.constraints.NotEmpty;

public class LogInRequest {

  @NotEmpty
  private String email;

  @NotEmpty
  private String password;
  
}
