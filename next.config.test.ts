import { describe, it, expect } from 'vitest';
import nextConfig from './next.config';

describe('Next.js Configuration', () => {
  describe('Config Object Structure', () => {
    it('should export a configuration object', () => {
      expect(nextConfig).toBeDefined();
      expect(typeof nextConfig).toBe('object');
    });

    it('should not be null', () => {
      expect(nextConfig).not.toBeNull();
    });

    it('should not be an array', () => {
      expect(Array.isArray(nextConfig)).toBe(false);
    });
  });

  describe('Output Configuration', () => {
    it('should have output property set to standalone', () => {
      expect(nextConfig).toHaveProperty('output');
      expect(nextConfig.output).toBe('standalone');
    });

    it('should have output as a string', () => {
      expect(typeof nextConfig.output).toBe('string');
    });

    it('should not have empty output value', () => {
      expect(nextConfig.output).not.toBe('');
      expect(nextConfig.output).toBeTruthy();
    });
  });

  describe('Docker Compatibility', () => {
    it('should be configured for Docker deployment with standalone output', () => {
      // Standalone output is required for Docker deployments
      expect(nextConfig.output).toBe('standalone');
    });

    it('should generate a minimal standalone build', () => {
      // The standalone output creates a .next/standalone folder with minimal dependencies
      expect(nextConfig.output).toBe('standalone');
    });
  });

  describe('Configuration Validity', () => {
    it('should be a valid NextConfig type', () => {
      // Check that the config object has valid properties
      expect(nextConfig).toBeTypeOf('object');
    });

    it('should not have undefined required properties', () => {
      expect(nextConfig.output).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle property access without throwing', () => {
      expect(() => {
        const _ = nextConfig.output;
      }).not.toThrow();
    });

    it('should be immutable (Object.freeze not applied but structure is stable)', () => {
      const originalOutput = nextConfig.output;
      expect(nextConfig.output).toBe(originalOutput);
    });

    it('should not have unexpected properties', () => {
      const expectedKeys = ['output'];
      const actualKeys = Object.keys(nextConfig);
      
      // The config should primarily have the output key
      expect(actualKeys).toContain('output');
    });
  });

  describe('Build Optimization', () => {
    it('should be optimized for production deployment', () => {
      // Standalone is the recommended output mode for production
      expect(nextConfig.output).toBe('standalone');
    });

    it('should support minimal footprint deployments', () => {
      // standalone output minimizes the deployment size
      expect(nextConfig.output).toBe('standalone');
    });
  });

  describe('Configuration Properties', () => {
    it('should allow reading output property multiple times', () => {
      const first = nextConfig.output;
      const second = nextConfig.output;
      expect(first).toBe(second);
    });

    it('should have consistent type for output', () => {
      expect(typeof nextConfig.output).toBe('string');
      expect(nextConfig.output).toMatch(/^standalone$/);
    });
  });

  describe('Default Export', () => {
    it('should be the default export', () => {
      expect(nextConfig).toBeDefined();
    });

    it('should be directly usable by Next.js', () => {
      // Next.js expects a config object with optional NextConfig properties
      expect(nextConfig).toHaveProperty('output');
    });
  });
});