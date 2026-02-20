package fyp.backend;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;
 

@Configuration
public class DotenvLoader {

    @PostConstruct
    public void loadEnv() {
        //load .env from root
        Dotenv dotenv = Dotenv.load();

        //set all variables as system properties so Spring can resolve ${varName}
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
