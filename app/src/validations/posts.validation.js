const joi = require('joi');

const postSchema = joi.object({
  title: joi.string().required().messages({
    'string.base': '제목은 문자열이어야 합니다.',
    'any.required': '데이터 형식이 올바르지 않습니다.',
    'string.empty': '제목을 입력해주세요.',
  }),
  content: joi.string().required().messages({
    'string.base': '내용은 문자열이어야 합니다.',
    'any.required': '데이터 형식이 올바르지 않습니다.',
    'string.empty': '내용을 입력해주세요.',
  }),
});

module.exports = postSchema;
