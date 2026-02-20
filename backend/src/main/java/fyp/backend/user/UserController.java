package fyp.backend.user;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

// import java.nio.file.attribute.UserPrincipal;
// import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


// import fyp.backend.user.dto.RegisterRequest;
// import fyp.backend.user.dto.UserResponse;
// import jakarta.validation.Valid;

// @RestController
// @RequestMapping("/users")
// public class UserController {

//   private final UserService userService;

//   public UserController(UserService userService) {
//     this.userService = userService;
//   }

//   @PostMapping("/register")
//   public UserResponse register(
//       @Valid @RequestBody RegisterRequest request
//   ) {
//     User user = userService.register(request);
//     return UserResponse.from(user);
//   }

//   /**
//    * Get current logged-in user
//    */
//   @GetMapping("/me")
//   public UserResponse me(
//       @AuthenticationPrincipal UserPrincipal principal
//   ) {
//     return UserResponse.from(
//       userService.getById(principal.getId())
//     );
//   }

//   /**
//    * Get public user info by ID
//    */
//   @GetMapping("/{id}")
//   public UserResponse getById(@PathVariable UUID id) {
//     return UserResponse.from(userService.getById(id));
//   }
// }


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController{

  @Autowired
  private final UserService userService;

  @PostMapping("/auth/register")
  public UserDTO register(@RequestBody UserDTO request) {
      userService.createUser(request);
      return request;
  }

  @GetMapping("/user/{id}")
  public UserDTO getUser(@RequestParam UUID userId) {
    return userService.getUserById(userId);  
  }
}