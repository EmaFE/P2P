package fyp.backend;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fyp.backend.user.User;
import fyp.backend.user.UserRepository;


@RestController
@RequestMapping("/test")
public class BackendApplicationTests {

    private final UserRepository userRepository;

    public BackendApplicationTests(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/add-user")
    public User addUser() {
        User u = new User();
        u.setUsername("Alice");
        u.setEmail("alice@test.com");
        return userRepository.save(u);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }
}

// @SpringBootTest
// class BackendApplicationTests {

// 	@Test
// 	void contextLoads() {
// 	}

// }


