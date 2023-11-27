export interface PostCreateRequest {
  content: string
  previewContent: string
}

export interface PostEditRequest {
  content: string
  previewContent: string
}

export interface Post {
  id: string
  content: string
  previewContent: string
  author: string
  createdDate: Date
  createdBy: string
  updatedDate: Date | null
  updatedBy: string | null
}

export interface PostReactionSetRequest {
  reaction: string
}

export interface PostReaction {
  subject: string
  reaction: string
}

export interface PostReactionDetails {
  reaction: string
  count: number
}

export interface PostCommentAddRequest {
  parentId: string | null
  content: string
}

export interface PostCommentEditRequest {
  content: string
}

export interface PostComment {
  id: string
  postId: string
  parentId: string | null
  content: string
  subject: string
  createdDate: Date
  createdBy: string
  updatedDate: Date | null
  updatedBy: string | null
}

export interface PostCommentReactionSetRequest {
  reaction: string
}

export interface PostCommentReaction {
  postCommentId: string
  subject: string
  reaction: string
}

export interface PostCommentReactionDetails {
  postCommentId: string
  reaction: string
  count: number
}
