const joi = require('joi');

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.base': '이메일은 문자열이어야 합니다.',
    'string.email': '이메일 형식이 아닙니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '이메일을 입력해주세요.',
  }),
  password: joi.string().required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '비밀번호를 입력해주세요.',
  }),
});

module.exports = {
  loginSchema,
};
