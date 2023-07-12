const joi = require('joi');

const commentSchema = joi.object({
  comment: joi.string().required().messages({
    'string.base': '댓글은 문자열이어야 합니다.',
    'any.required': '데이터 형식이 올바르지 않습니다.',
    'string.empty': '댓글을 입력해주세요.',
  }),
});

module.exports = commentSchema;
