const joi = require('joi');

const signupSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.base': '이메일은 문자열이어야 합니다.',
    'string.email': '이메일 형식이 아닙니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '이메일은 필수 항목입니다.',
  }),
  nickname: joi.string().alphanum().required().messages({
    'string.base': '닉네임은 문자열이어야 합니다.',
    'string.alphanum': '닉네임은 알파벳 문자와 숫자만 포함해야 합니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '닉네임은 필수 항목입니다.',
  }),
  password: joi.string().min(6).required().messages({
    'string.base': '비밀번호는 문자열이어야 합니다.',
    'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '비밀번호는 필수 항목입니다.',
  }),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'string.base': '비밀번호 확인은 문자열이어야 합니다.',
    'any.only': '비밀번호가 일치하지 않습니다.',
    'any.required': '요청한 데이터 형식이 올바르지 않습니다.',
    'string.empty': '비밀번호 확인은 필수 항목입니다.',
  }),
});

module.exports = {
  signupSchema,
};
