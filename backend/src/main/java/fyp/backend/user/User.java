package fyp.backend.user;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  private UUID userId;

  @Field
  @NotBlank
  @Indexed(unique = true)
  private String username;
  
  @Field
  @NotBlank
  @Indexed(unique = true)
  private String email;

  @Field
  @NotBlank
  private String role;

  @Field
  @NotBlank
  private String passwordHash;

  private List<String> likedPostsId = new ArrayList<>();
}
