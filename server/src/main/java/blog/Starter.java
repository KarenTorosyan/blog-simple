package blog;

import blog.entities.post.out.persistence.r2dbc.PostCommentRowMapper;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.r2dbc.core.DatabaseClient;

import java.util.Map;
import java.util.Objects;

@SpringBootApplication
@ConfigurationPropertiesScan
public class Starter {
    public static void main(String[] args) {
        SpringApplication.run(Starter.class, args);
    }

//    @Bean
//    ApplicationRunner lirunner(DatabaseClient client) {
//        return args -> {
//            client.sql("select post_comment_id, reaction, count(reaction) as reaction_count " +
//                            "from post_comment_reactions group by post_comment_id, reaction")
//                    .map(row ->
//                            Map.of(Objects.requireNonNull(row.get("post_comment_id", String.class)),
//                                    Map.of(Objects.requireNonNull(row.get("reaction", String.class)),
//                                            Objects.requireNonNull(row.get("reaction_count", Long.class)))))
//                    .all()
//                    .subscribe(System.out::println);
//        };
//    }
////
//    @Bean
//    ApplicationRunner getAllByParentId(DatabaseClient client) {
//        return args -> {
//            client.sql("select id, parent_id, post_id, content, subject, created_date, created_by, updated_date, updated_by " +
//                    "from post_comments where parent_id = :parentId")
//                    .bind("parentId", 1)
//                    .map(PostCommentRowMapper::map)
//                    .all()
//                    .subscribe(System.out::println);
//        };
//    }

//    @Bean
//    ApplicationRunner getComments(DatabaseClient client) {
//        return args -> {
//            client.sql("select id, parent_id, post_id, content, subject, created_date, created_by, updated_date, updated_by " +
//                            "from post_comments where parent_id = :parentId")
//                    .bind("parentId", null)
//                    .map(PostCommentRowMapper::map)
//                    .all()
//                    .subscribe(System.out::println);
//        };
//    }
}

