import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  allowedValues?: string[];
  customValidator?: (value: any) => { valid: boolean; message?: string };
}

/**
 * Common regex pattern to detect potential malicious payload or prompt injection artifacts.
 * Blocks zero-width unicode obfuscation, script tags, dangerous HTML tags, and abnormal control characters.
 */
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<\/?(?:iframe|embed|object|base|meta|link|svg|math|form|input|button|style)[^>]*>/gi,
  /javascript\s*:/gi,
  /data:\s*text\/html/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi, // e.g. onload=, onclick=
  /[\u200B-\u200D\uFEFF]/g, // Zero-width spaces and invisible characters
];

/**
 * Sanitizes input string by removing zero-width characters and excessive repeated control characters
 */
export function sanitizeInput(value: string): string {
  if (typeof value !== 'string') return '';
  let sanitized = value.trim();
  // Remove zero width and non-printable control characters (except newline \n, tab \t, carriage return \r)
  sanitized = sanitized.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
  return sanitized;
}

/**
 * Detects if the text contains high-risk injection payload or dangerous HTML/script markers
 */
export function checkMaliciousPayload(text: string): { isMalicious: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isMalicious: true,
        reason: '입력값에 허용되지 않는 스크립트 또는 위험한 HTML 태그가 포함되어 있습니다.',
      };
    }
  }

  // Check for abnormal excessive token repetition attacks (e.g. 5,000 continuous same characters)
  if (/(.)\1{300,}/.test(text)) {
    return {
      isMalicious: true,
      reason: '비정상적으로 반복되는 문자열 패턴이 감지되었습니다.',
    };
  }

  return { isMalicious: false };
}

/**
 * Express Middleware factory for request payload validation & sanitization
 */
export function validateRequestBody(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: '유효한 요청 본문(JSON)이 필요합니다.' });
      return;
    }

    for (const rule of rules) {
      const rawValue = req.body[rule.field];

      // 1. Required check
      if (rule.required && (rawValue === undefined || rawValue === null || rawValue === '')) {
        res.status(400).json({ error: `'${rule.field}' 필드는 필수 입력 항목입니다.` });
        return;
      }

      // If value is provided, validate further
      if (rawValue !== undefined && rawValue !== null) {
        // 2. Type validation
        if (rule.type && typeof rawValue !== rule.type) {
          res.status(400).json({
            error: `'${rule.field}' 필드는 ${rule.type} 타입이어야 합니다.`,
          });
          return;
        }

        // 3. String-specific length and malicious payload check
        if (typeof rawValue === 'string') {
          const sanitized = sanitizeInput(rawValue);
          req.body[rule.field] = sanitized;

          if (rule.minLength !== undefined && sanitized.length < rule.minLength) {
            res.status(400).json({
              error: `'${rule.field}'의 길이는 최소 ${rule.minLength}자 이상이어야 합니다.`,
            });
            return;
          }

          if (rule.maxLength !== undefined && sanitized.length > rule.maxLength) {
            res.status(400).json({
              error: `'${rule.field}'의 길이는 최대 ${rule.maxLength.toLocaleString()}자 이하로 제한됩니다. (현재: ${sanitized.length.toLocaleString()}자)`,
            });
            return;
          }

          // Security check
          const maliciousCheck = checkMaliciousPayload(sanitized);
          if (maliciousCheck.isMalicious) {
            res.status(400).json({
              error: maliciousCheck.reason || '보안 정책에 의해 차단된 입력값입니다.',
            });
            return;
          }
        }

        // 4. Allowed enum values
        if (rule.allowedValues && !rule.allowedValues.includes(req.body[rule.field])) {
          res.status(400).json({
            error: `'${rule.field}'의 값은 [${rule.allowedValues.join(', ')}] 중 하나여야 합니다.`,
          });
          return;
        }

        // 5. Custom validator
        if (rule.customValidator) {
          const customResult = rule.customValidator(req.body[rule.field]);
          if (!customResult.valid) {
            res.status(400).json({
              error: customResult.message || `'${rule.field}'의 값이 유효하지 않습니다.`,
            });
            return;
          }
        }
      }
    }

    next();
  };
}
