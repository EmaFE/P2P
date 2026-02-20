error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserController.java:java/nio/file/attribute/UserPrincipal#
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserController.java
empty definition using pc, found symbol in pc: java/nio/file/attribute/UserPrincipal#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 68
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserController.java
text:
```scala
package fyp.backend.user;

import java.nio.file.attribute.UserPrin@@cipal;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fyp.backend.user.dto.RegisterRequest;
import fyp.backend.user.dto.UserResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  /**
   * Register a new user
   */
  @PostMapping("/register")
  public UserResponse register(
      @Valid @RequestBody RegisterRequest request
  ) {
    User user = userService.register(request);
    return UserResponse.from(user);
  }

  /**
   * Get current logged-in user
   */
  @GetMapping("/me")
  public UserResponse me(
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    return UserResponse.from(
      userService.getById(principal.getId())
    );
  }

  /**
   * Get public user info by ID
   */
  @GetMapping("/{id}")
  public UserResponse getById(@PathVariable UUID id) {
    return UserResponse.from(userService.getById(id));
  }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: java/nio/file/attribute/UserPrincipal#