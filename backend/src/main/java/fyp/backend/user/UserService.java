 package fyp.backend.user;

import java.util.UUID;

// import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;
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
    newUser.setEmail(userdto.getEmail());
    newUser.setUsername(userdto.getUsername());
    newUser.setPasswordHash(
      passwordEncoder.encode(userdto.getPassword())
    );
    newUser.setRole(userdto.getRole());

    userRepository.save(newUser);

    return userdto;
  }

  public UserDTO getUserById(UUID id){
    User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    return UserDTO.fromEntity(user);
  }

}