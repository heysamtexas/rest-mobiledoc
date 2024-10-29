const MobiledocService = require('../../../src/services/mobiledoc.service');

describe('MobiledocService', () => {
  describe('convert', () => {
    test('should convert HTML to mobiledoc', () => {
      const result = MobiledocService.convert('<p>Hello, world!</p>', 'html');
      expect(result).toHaveProperty('version', '0.3.1');
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0]).toEqual([1, 'p', [[0, [], 0, 'Hello, world!']]]);
    });

    test('should convert simple markdown to mobiledoc', () => {
      const result = MobiledocService.convert('# Hello, world!', 'markdown');
      expect(result).toHaveProperty('version', '0.3.1');
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0][1]).toBe('h1');
      expect(result.sections[0][2][0][3]).toBe('Hello, world!');
    });

    test('should convert multi-section markdown to mobiledoc', () => {
      const result = MobiledocService.convert('# Hello, world!\n\nThis is a paragraph.', 'markdown');
      expect(result).toHaveProperty('version', '0.3.1');
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0]).toEqual([1, 'h1', [[0, [], 0, 'Hello, world!']]]);
      expect(result.sections[1]).toEqual([1, 'p', [[0, [], 0, 'This is a paragraph.']]]);
    });

    test('should throw error for invalid source type', () => {
      expect(() => {
        MobiledocService.convert('Hello, world!', 'invalid');
      }).toThrow("Invalid source type: invalid. Expected 'html' or 'markdown'.");
    });
  });
});
