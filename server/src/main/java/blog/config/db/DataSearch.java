package blog.config.db;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("data-search")
@Getter
public class DataSearch {

    private DataSearchAdapter adapter;

    public void setAdapter(DataSearchAdapter adapter) {
        this.adapter = adapter;
    }
}
