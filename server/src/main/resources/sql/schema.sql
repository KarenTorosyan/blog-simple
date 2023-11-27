create table if not exists posts(
    id bigserial primary key,
    author varchar(100) not null,
    content text not null,
    preview_content text not null,
    created_date timestamp not null,
    created_by varchar(100) not null,
    updated_date timestamp,
    updated_by varchar(100)
);

alter table if exists posts
    add column if not exists ts tsvector generated always as (
        setweight(to_tsvector('english', author), 'A') ||
        setweight(to_tsvector('english', preview_content), 'B') ||
        setweight(to_tsvector('english', content), 'C')
    ) stored;

create index if not exists ts_index on posts using gin(ts);

create table if not exists post_comments(
    id bigserial primary key,
    post_id bigint not null,
    subject varchar(100) not null,
    parent_id bigint,
    content text not null,
    created_date timestamp not null,
    created_by varchar(100) not null,
    updated_date timestamp,
    updated_by varchar(100),
    foreign key (post_id) references posts(id)
        on delete cascade,
    foreign key (parent_id) references post_comments(id)
        on delete cascade
);

create table if not exists post_reactions(
    post_id bigint not null,
    subject varchar(100) not null,
    reaction varchar(100) not null,
    primary key (post_id, subject, reaction),
    foreign key (post_id) references posts(id)
        on delete cascade
);

create table if not exists post_comment_reactions(
    post_comment_id bigint not null,
    subject varchar(100) not null,
    reaction varchar(100) not null,
    primary key (post_comment_id, subject, reaction),
    foreign key (post_comment_id) references post_comments(id)
        on delete cascade
);
