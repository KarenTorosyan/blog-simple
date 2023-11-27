package blog.errors;

import blog.entities.post.Post;
import blog.entities.post.PostComment;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Errors {

    public static IllegalParamException illegalIdType(String id) {
        return new IllegalParamException("The id must be contain only number!", "id_must_be_contain_only_numbers", id);
    }

    public static AccessException noEnoughAccess(String user) {
        return new AccessException("You haven't enough access!", "no_enough_access", user);
    }

    public static IllegalParamException illegalSortParam(String param) {
        return new IllegalParamException("The illegal sort param " + param, "illegal_sort_param", param);
    }

    public static EntityConflictException cantCreatePost(Post post, Throwable e) {
        String message = "Can't create post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_cant_create", post);
    }

    public static EntityConflictException cantEditPost(Post post, Throwable e) {
        String message = "Can't edit post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_cant_edit", post);
    }

    public static EntityConflictException cantDeletePost(String id, Throwable e) {
        String message = "Can't delete post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_cant_delete", id);
    }

    public static EntityNotFoundException postNotFoundById(String id) {
        return new EntityNotFoundException("The post not found!", "post_not_found_by_id", id);
    }

    public static EntityConflictException cantAddPostComment(PostComment postComment, Throwable e) {
        String message = "Can't add comment in post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_comment_cant_add", postComment);
    }

    public static EntityConflictException cantEditPostComment(PostComment postComment, Throwable e) {
        String message = "Can't edit post comment";
        logError(message, e);
        return new EntityConflictException(message, e, "post_comment_cant_edit", postComment);
    }

    public static EntityConflictException cantDeletePostComment(String commentId, String postId, Throwable e) {
        String message = "Can't delete post comment";
        logError(message, e);
        return new EntityConflictException(message, e, "post_comment_cant_delete", commentId, postId);
    }

    public static EntityNotFoundException postCommentNotFoundByIds(String postId, String commentId) {
        return new EntityNotFoundException("The comment not found!", "post_comment_not_found_by_ids", postId, commentId);
    }

    public static EntityNotFoundException postCommentNotFoundById(String commentId) {
        return new EntityNotFoundException("The comment not found!", "post_comment_not_found_by_id", commentId);
    }

    public static EntityConflictException cantSetPostStatistic(String postId, Throwable e) {
        String message = "Can't set post statistic";
        logError(message, e);
        return new EntityConflictException(message, e, "post_statistic_cant_set", postId);
    }

    public static EntityNotFoundException postStatisticNotFound(String postId) {
        return new EntityNotFoundException("The post haven't statistic!", "post_statistic_not_found", postId);
    }

    public static EntityConflictException cantSetPostReaction(String postId, String subject, String reaction, Throwable e) {
        String message = "Can't set reaction '" + reaction + "' in post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_reaction_cant_set", postId, subject, reaction);
    }

    public static EntityConflictException cantDeletePostReaction(String postId, String subject, Throwable e) {
        String message = "Can't delete reaction from post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_reaction_cant_delete", postId, subject);
    }

    public static EntityNotFoundException postReactionNotFound(String postId, String subject) {
        return new EntityNotFoundException("The reaction not found!", "post_reaction_not_found", postId, subject);
    }

    public static EntityNotFoundException postReactionNotFoundByReaction(String postId, String reaction) {
        return new EntityNotFoundException("The reaction '" + reaction + "' not found!", "post_reaction_not_found_by_name", postId, reaction);
    }

    public static EntityConflictException cantSetPostCommentReaction(String postCommentId, String subject, String reaction, Throwable e) {
        String message = "Can't set reaction '" + reaction + "' in post";
        logError(message, e);
        return new EntityConflictException(message, e, "post_comment_reaction_cant_set", postCommentId, subject, reaction);
    }

    public static EntityConflictException cantDeletePostCommentReaction(String postCommentId, String subject, Throwable e) {
        String message = "Can't delete reaction from post comment";
        logError(message, e);
        return new EntityConflictException(message, e, "post_comment_reaction_cant_delete", postCommentId, subject);
    }

    public static EntityNotFoundException postCommentReactionNotFound(String postCommentId, String subject) {
        return new EntityNotFoundException("The reaction not found!", "post_comment_reaction_not_found", postCommentId, subject);
    }

    public static EntityNotFoundException postCommentReactionNotFoundByReaction(String postCommentId, String reaction) {
        return new EntityNotFoundException("The reaction '" + reaction + "' not found!", "post_comment_reaction_not_found", postCommentId, reaction);
    }

    private static void logError(String message, Throwable e) {
        log.error(message, e);
    }
}
