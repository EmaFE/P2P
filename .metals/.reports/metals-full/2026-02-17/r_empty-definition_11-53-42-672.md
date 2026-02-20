error id: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java:_empty_/user#
file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java
empty definition using pc, found symbol in pc: _empty_/user#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 2106
uri: file:///C:/Users/flore/Uni/Y4/FYP/code/backend/src/main/java/fyp/backend/user/UserService.java
text:
```scala
 package fyp.backend.user;

// import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// import fyp.backend.user.dto.RegisterRequest;

// @Service
// public class UserService {

//   @Autowired
//   private UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//   public UserService(
//       UserRepository userRepository,
//       PasswordEncoder passwordEncoder
//   ) {
//     this.userRepository = userRepository;
//     this.passwordEncoder = passwordEncoder;
//   }

//   public User register(RegisterRequest request) {

//     if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//       throw new BadRequestException("Email already in use");
//     }

//     User user = new User();
//     user.setUsername(request.getUsername());
//     user.setEmail(request.getEmail());
//     user.setPasswordHash(
//         passwordEncoder.encode(request.getPassword())
//     );

//     return userRepository.save(user);
//   }

//   public User getById(UUID id) {
//     return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
//   }
// }

@Service
@AllArgsConstructor
public class UserService{

 @Autowired
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserDTO createUser (UserDTO userdto){
    if(userRepository.emailExists(userdto.getEmail())){
      throw new RuntimeException("User already exists with this email address.");
    }

    User newUser = new User();
    user.setEmail(userdto.getEmail());
    user.setUsername(userdto.getUsername());
    user.setPasswordHash(
      passwordEncoder.encode(userdto.getPassword());
    );
    use@@r.setRole(userdto.getRole());

    userRepository.save(user);

  }





}

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/user#