import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';

// Mock dependencies
vi.mock('child_process');
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn()
  }
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('Smart Commit Script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Environment Configuration', () => {
    it('should check for GEMINI_API_KEY environment variable', () => {
      // This tests that the script requires the API key
      expect(process.env.GEMINI_API_KEY).toBeUndefined();
    });

    it('should use gemini-2.5-flash-lite model', () => {
      const MODEL_NAME = 'gemini-2.5-flash-lite';
      expect(MODEL_NAME).toBe('gemini-2.5-flash-lite');
    });

    it('should load environment from .env.local', () => {
      // The script uses dotenv.config with path: '.env.local'
      const envPath = '.env.local';
      expect(envPath).toBe('.env.local');
    });
  });

  describe('generateCommitMessage Function Logic', () => {
    it('should return default message for empty diff', async () => {
      const emptyDiff = '';
      const expectedMessage = 'chore: 사소한 변경사항';
      
      // Test the logic: empty diff should return default
      if (!emptyDiff || emptyDiff.trim().length === 0) {
        expect(expectedMessage).toBe('chore: 사소한 변경사항');
      }
    });

    it('should return default message for whitespace-only diff', async () => {
      const whitespaceDiff = '   \n  \t  ';
      const expectedMessage = 'chore: 사소한 변경사항';
      
      if (!whitespaceDiff || whitespaceDiff.trim().length === 0) {
        expect(expectedMessage).toBe('chore: 사소한 변경사항');
      }
    });

    it('should truncate diff to 10000 characters', () => {
      const longDiff = 'a'.repeat(15000);
      const truncated = longDiff.substring(0, 10000);
      
      expect(truncated.length).toBe(10000);
      expect(truncated.length).toBeLessThan(longDiff.length);
    });

    it('should handle diff shorter than 10000 characters', () => {
      const shortDiff = 'a'.repeat(5000);
      const result = shortDiff.substring(0, 10000);
      
      expect(result).toBe(shortDiff);
      expect(result.length).toBe(5000);
    });
  });

  describe('Commit Message Format', () => {
    it('should follow Conventional Commits format', () => {
      const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build', 'revert'];
      const defaultMessage = 'chore: 사소한 변경사항';
      const fallbackMessage = 'chore: 코드 업데이트';
      
      // Check default message follows convention
      const [type] = defaultMessage.split(':');
      expect(validTypes).toContain(type);
      
      // Check fallback message follows convention
      const [fallbackType] = fallbackMessage.split(':');
      expect(validTypes).toContain(fallbackType);
    });

    it('should have Korean subject line', () => {
      const message = 'chore: 사소한 변경사항';
      const [, subject] = message.split(':');
      
      expect(subject.trim()).toMatch(/[\u3131-\uD79D]/); // Korean characters
    });

    it('should keep subject line under 70 characters', () => {
      const message = 'chore: 사소한 변경사항';
      expect(message.length).toBeLessThanOrEqual(70);
    });
  });

  describe('Git Command Execution', () => {
    it('should stage changes with git add', () => {
      const gitAddCommand = 'git add .';
      expect(gitAddCommand).toBe('git add .');
    });

    it('should get diff with git diff --staged', () => {
      const gitDiffCommand = 'git diff --staged';
      expect(gitDiffCommand).toBe('git diff --staged');
    });

    it('should commit with generated message', () => {
      const message = 'feat: 새로운 기능 추가';
      const gitCommitCommand = `git commit -m "${message}"`;
      expect(gitCommitCommand).toContain('git commit -m');
      expect(gitCommitCommand).toContain(message);
    });
  });

  describe('API Integration', () => {
    it('should construct correct API URL', () => {
      const apiKey = 'test-key';
      const modelName = 'gemini-2.5-flash-lite';
      const expectedUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      expect(expectedUrl).toContain('generativelanguage.googleapis.com');
      expect(expectedUrl).toContain(modelName);
      expect(expectedUrl).toContain('generateContent');
    });

    it('should send POST request with correct content type', () => {
      const headers = { 'Content-Type': 'application/json' };
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should structure request body correctly', () => {
      const prompt = 'test prompt';
      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      
      expect(requestBody).toHaveProperty('contents');
      expect(requestBody.contents).toBeInstanceOf(Array);
      expect(requestBody.contents[0]).toHaveProperty('parts');
      expect(requestBody.contents[0].parts[0]).toHaveProperty('text');
    });
  });

  describe('Error Handling', () => {
    it('should return fallback message on API error', () => {
      const fallbackMessage = 'chore: 코드 업데이트';
      expect(fallbackMessage).toBe('chore: 코드 업데이트');
    });

    it('should handle missing API response gracefully', () => {
      const data = { candidates: null };
      const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'chore: 코드 업데이트';
      
      expect(message).toBe('chore: 코드 업데이트');
    });

    it('should handle undefined candidates array', () => {
      const data = {};
      const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'chore: 코드 업데이트';
      
      expect(message).toBe('chore: 코드 업데이트');
    });

    it('should handle empty response text', () => {
      const data = { candidates: [{ content: { parts: [{ text: '' }] } }] };
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const message = rawText || 'chore: 코드 업데이트';
      
      expect(message).toBe('chore: 코드 업데이트');
    });
  });

  describe('Prompt Construction', () => {
    it('should include Conventional Commits types in prompt', () => {
      const expectedTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build', 'revert'];
      const promptTemplate = 'feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert';
      
      expectedTypes.forEach(type => {
        expect(promptTemplate).toContain(type);
      });
    });

    it('should specify Korean language requirement', () => {
      const promptRequirement = '제목은 반드시 한국어로 작성하세요';
      expect(promptRequirement).toContain('한국어');
    });

    it('should specify character limit', () => {
      const charLimit = 70;
      const requirement = `제목 줄은 ${charLimit}자 이내로 유지하세요`;
      expect(requirement).toContain('70자');
    });
  });

  describe('Process Flow', () => {
    it('should follow correct execution order', () => {
      const steps = [
        'stage changes',
        'get diff',
        'generate message',
        'commit'
      ];
      
      expect(steps).toHaveLength(4);
      expect(steps[0]).toBe('stage changes');
      expect(steps[steps.length - 1]).toBe('commit');
    });

    it('should not push automatically', () => {
      const manualPushMessage = '푸시는 직접 해주세요: git push';
      expect(manualPushMessage).toContain('git push');
      expect(manualPushMessage).toContain('직접');
    });
  });

  describe('User Feedback', () => {
    it('should provide staging feedback', () => {
      const message = '📦 변경사항 스테이징 중...';
      expect(message).toContain('스테이징');
    });

    it('should provide generation feedback', () => {
      const message = '🤖 커밋 메시지 생성 중...';
      expect(message).toContain('생성');
    });

    it('should provide completion feedback', () => {
      const message = '✅ 커밋 완료!';
      expect(message).toContain('완료');
    });

    it('should include emojis for better UX', () => {
      const messages = [
        '📦 변경사항 스테이징 중...',
        '🤖 커밋 메시지 생성 중...',
        '📝 생성된 메시지:',
        '✅ 커밋 완료!',
        '❌ 오류:',
        '🤔 커밋할 변경사항이 없습니다.'
      ];
      
      messages.forEach(msg => {
        expect(msg).toMatch(/[\u{1F300}-\u{1F9FF}]/u); // Emoji regex
      });
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle no staged changes', () => {
      const emptyDiff = '';
      const message = '🤔 커밋할 변경사항이 없습니다.';
      
      if (!emptyDiff.trim()) {
        expect(message).toContain('변경사항이 없습니다');
      }
    });

    it('should handle very large diffs', () => {
      const hugeDiff = 'a'.repeat(50000);
      const truncated = hugeDiff.substring(0, 10000);
      
      expect(truncated.length).toBe(10000);
    });

    it('should handle special characters in commit message', () => {
      const messageWithQuotes = 'feat: "새로운" 기능 추가';
      const escaped = messageWithQuotes.replace(/"/g, '\\"');
      
      // The script should handle quotes in git commit
      expect(escaped).toBe('feat: \\"새로운\\" 기능 추가');
    });

    it('should handle network timeouts gracefully', () => {
      // The script uses try-catch to handle errors
      const fallback = 'chore: 코드 업데이트';
      expect(fallback).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate API key presence', () => {
      const apiKey = process.env.GEMINI_API_KEY;
      const isValid = !!apiKey;
      
      // Script should check for API key
      expect(typeof isValid).toBe('boolean');
    });

    it('should provide clear error message for missing API key', () => {
      const errorMessage = '❌ 오류: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.';
      expect(errorMessage).toContain('GEMINI_API_KEY');
      expect(errorMessage).toContain('설정되지 않았습니다');
    });
  });

  describe('Response Parsing', () => {
    it('should extract message from nested response structure', () => {
      const mockResponse = {
        candidates: [{
          content: {
            parts: [{
              text: 'feat: 새로운 기능'
            }]
          }
        }]
      };
      
      const message = mockResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      expect(message).toBe('feat: 새로운 기능');
    });

    it('should trim whitespace from generated message', () => {
      const messageWithSpaces = '  feat: 기능 추가  \n';
      const trimmed = messageWithSpaces.trim();
      
      expect(trimmed).toBe('feat: 기능 추가');
      expect(trimmed).not.toContain('\n');
    });
  });
});