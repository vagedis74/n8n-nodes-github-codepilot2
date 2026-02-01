import { extractJson } from '../nodes/GitHubCodepilot/utils';

describe('extractJson', () => {
	it('should parse valid JSON directly', () => {
		const result = extractJson('{"key": "value"}');
		expect(result).toEqual({ key: 'value' });
	});

	it('should parse a JSON array directly', () => {
		const result = extractJson('[1, 2, 3]');
		expect(result).toEqual([1, 2, 3]);
	});

	it('should extract JSON object from surrounding text', () => {
		const text = 'Here is the result:\n{"confidence": "high", "solution": "restart"}\nDone.';
		const result = extractJson(text);
		expect(result).toEqual({ confidence: 'high', solution: 'restart' });
	});

	it('should extract JSON array from surrounding text', () => {
		const text = 'Results:\n[{"a": 1}, {"a": 2}]\nEnd.';
		const result = extractJson(text);
		expect(result).toEqual([{ a: 1 }, { a: 2 }]);
	});

	it('should return null for non-JSON text', () => {
		const result = extractJson('This is just plain text with no JSON.');
		expect(result).toBeNull();
	});

	it('should handle empty string', () => {
		const result = extractJson('');
		expect(result).toBeNull();
	});

	it('should extract nested JSON objects', () => {
		const text = '```json\n{"nodes": [{"type": "n8n-nodes-base.httpRequest"}], "connections": {}}\n```';
		const result = extractJson(text) as any;
		expect(result).toBeDefined();
		expect(result.nodes).toHaveLength(1);
		expect(result.connections).toEqual({});
	});

	it('should handle JSON with whitespace/newlines', () => {
		const text = `{
  "confidence": "medium",
  "problem_summary": "test",
  "solution": "do this",
  "reasoning": "because"
}`;
		const result = extractJson(text) as any;
		expect(result.confidence).toBe('medium');
	});
});
