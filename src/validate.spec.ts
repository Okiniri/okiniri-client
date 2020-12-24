
import { describe, expect, test } from '@jest/globals';

import {
  validateCreateObjects,
  validateDeleteObjects,
  validateCreateOrDeleteLinks,
  validateQuery,
} from './validate';

describe('Test the validations functions', () => {
  describe('validateCreateObjects()', () => {
    test('should fail with not an array', () => {
      const run1 = () => validateCreateObjects(undefined);
      const run2 = () => validateCreateObjects(false);
      const run3 = () => (validateCreateObjects as any)();

      expect(run1).toThrowError('data should be array');
      expect(run2).toThrowError('data should be array');
      expect(run3).toThrowError('data should be array');
    });

    test('should fail with incorrect min/max items', () => {
      const run1 = () => validateCreateObjects([]);
      const run2 = () => validateCreateObjects(Array.from(Array(101)));

      expect(run1).toThrowError('data should NOT have fewer than 1 items');
      expect(run2).toThrowError('data should NOT have more than 100 items');
    });

    test('should fail with item not an object', () => {
      const run1 = () => validateCreateObjects([false]);
      const run2 = () => validateCreateObjects([{ tag: 'tag' }, undefined]);

      expect(run1).toThrowError('data.0 should be object');
      expect(run2).toThrowError('data.1 should be object');
    });

    test('should fail with item not having tag', () => {
      const run1 = () => validateCreateObjects([{ failure: true }]);
      const run2 = () => validateCreateObjects([{ tag: 'tag' }, { id: 'id' }]);

      expect(run1).toThrowError('data.0 should have required property \'tag\'');
      expect(run2).toThrowError('data.1 should have required property \'tag\'');
    });

    test('should fail with item having malformed tag', () => {
      const run1 = () => validateCreateObjects([{ tag: false }]);
      const run2 = () => validateCreateObjects([{ tag: '' }]);
      const run3 = () => validateCreateObjects([{ tag: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }]);
      const run4 = () => validateCreateObjects([{ tag: 'tag' }, { tag: '*' }]);

      expect(run1).toThrowError('data.0.tag should be string');
      expect(run2).toThrowError('data.0.tag should NOT have fewer than 1 characters');
      expect(run3).toThrowError('data.0.tag should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.tag should match pattern "^[a-zA-Z0-9_]+$"');
    });

    test('should fail with item having malformed id', () => {
      const run1 = () => validateCreateObjects([{ tag: 'tag', id: false }]);
      const run2 = () => validateCreateObjects([{ tag: 'tag', id: 'i' }]);
      const run3 = () => validateCreateObjects([{ tag: 'tag', id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }]);
      const run4 = () => validateCreateObjects([{ tag: 'tag' }, { tag: 'tag', id: '*a' }]);

      expect(run1).toThrowError('data.0.id should be string');
      expect(run2).toThrowError('data.0.id should NOT have fewer than 2 characters');
      expect(run3).toThrowError('data.0.id should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.id should match pattern "^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$"');
    });


    test('should succeed', () => {
      const run1 = () => validateCreateObjects([{ tag: 'tag' }]);
      const run2 = () => validateCreateObjects([{ tag: 'tag', id: 'id_0' }]);
      const run3 = () => validateCreateObjects([{ tag: 'tag' }, { tag: 'tag', id: '00' }]);
      const run4 = () => validateCreateObjects([{ tag: 'tag', id: '0_a' }, { tag: 'tag', unknown: false }]);

      expect(run1).not.toThrow();
      expect(run2).not.toThrow();
      expect(run3).not.toThrow();
      expect(run4).not.toThrow();
    });
  });


  // --------------------------


  describe('validateDeleteObjects()', () => {
    test('should fail with not an array', () => {
      const run1 = () => validateDeleteObjects(undefined);
      const run2 = () => validateDeleteObjects(false);
      const run3 = () => (validateDeleteObjects as any)();

      expect(run1).toThrowError('data should be array');
      expect(run2).toThrowError('data should be array');
      expect(run3).toThrowError('data should be array');
    });


    test('should fail with incorrect min/max items', () => {
      const run1 = () => validateDeleteObjects([]);
      const run2 = () => validateDeleteObjects(Array.from(Array(101)));

      expect(run1).toThrowError('data should NOT have fewer than 1 items');
      expect(run2).toThrowError('data should NOT have more than 100 items');
    });


    test('should fail with item not an object', () => {
      const run1 = () => validateDeleteObjects([false]);
      const run2 = () => validateDeleteObjects([{ id: 'id' }, undefined]);

      expect(run1).toThrowError('data.0 should be object');
      expect(run2).toThrowError('data.1 should be object');
    });


    test('should fail with item not having id', () => {
      const run1 = () => validateDeleteObjects([{ failure: true }]);
      const run2 = () => validateDeleteObjects([{ id: 'id' }, { notId: 'failure' }]);

      expect(run1).toThrowError('data.0 should have required property \'id\'');
      expect(run2).toThrowError('data.1 should have required property \'id\'');
    });


    test('should fail with item having malformed id', () => {
      const run1 = () => validateDeleteObjects([{ id: false }]);
      const run2 = () => validateDeleteObjects([{ id: 'i' }]);
      const run3 = () => validateDeleteObjects([{ id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }]);
      const run4 = () => validateDeleteObjects([{ id: 'id' }, { id: '*a' }]);

      expect(run1).toThrowError('data.0.id should be string');
      expect(run2).toThrowError('data.0.id should NOT have fewer than 2 characters');
      expect(run3).toThrowError('data.0.id should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.id should match pattern "^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$"');
    });


    test('should succeed', () => {
      const run1 = () => validateDeleteObjects([{ id: 'id_0' }]);
      const run2 = () => validateDeleteObjects([{ id: 'id_0' }, { id: 'id_1' }]);
      const run3 = () => validateDeleteObjects([{ id: '0_a' }, { id: '0_b', unknown: false }]);

      expect(run1).not.toThrow();
      expect(run2).not.toThrow();
      expect(run3).not.toThrow();
    });
  });


  // --------------------------


  describe('validateCreateOrDeleteLinks()', () => {
    test('should fail with not an array', () => {
      const run1 = () => validateCreateOrDeleteLinks(undefined);
      const run2 = () => validateCreateOrDeleteLinks(false);
      const run3 = () => (validateCreateOrDeleteLinks as any)();

      expect(run1).toThrowError('data should be array');
      expect(run2).toThrowError('data should be array');
      expect(run3).toThrowError('data should be array');
    });


    test('should fail with incorrect min/max items', () => {
      const run1 = () => validateCreateOrDeleteLinks([]);
      const run2 = () => validateCreateOrDeleteLinks(Array.from(Array(51)));

      expect(run1).toThrowError('data should NOT have fewer than 1 items');
      expect(run2).toThrowError('data should NOT have more than 50 items');
    });


    test('should fail with item not an object', () => {
      const run1 = () => validateCreateOrDeleteLinks([false]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, undefined]);

      expect(run1).toThrowError('data.0 should be object');
      expect(run2).toThrowError('data.1 should be object');
    });


    test('should fail with item not having fromId', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ failure: true, linkTag: 'tag', toId: 'toId' }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { notId: 'failure', linkTag: 'tag', toId: 'toId' }]);

      expect(run1).toThrowError('data.0 should have required property \'fromId\'');
      expect(run2).toThrowError('data.1 should have required property \'fromId\'');
    });


    test('should fail with item not having linkTag', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', failure: true, toId: 'toId' }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: 'fromId', notTag: 'failure', toId: 'toId' }]);

      expect(run1).toThrowError('data.0 should have required property \'linkTag\'');
      expect(run2).toThrowError('data.1 should have required property \'linkTag\'');
    });


    test('should fail with item not having toId', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', failure: true }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: 'fromId', linkTag: 'tag', notToId: 'toId' }]);

      expect(run1).toThrowError('data.0 should have required property \'toId\'');
      expect(run2).toThrowError('data.1 should have required property \'toId\'');
    });

    test('should fail with item having malformed fromId', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: false, linkTag: 'tag', toId: 'toId' }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'i', linkTag: 'tag', toId: 'toId' }]);
      const run3 = () => validateCreateOrDeleteLinks([{ fromId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', linkTag: 'tag', toId: 'toId' }]);
      const run4 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: '*a', linkTag: 'tag', toId: 'toId' }]);

      expect(run1).toThrowError('data.0.fromId should be string');
      expect(run2).toThrowError('data.0.fromId should NOT have fewer than 2 characters');
      expect(run3).toThrowError('data.0.fromId should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.fromId should match pattern "^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$"');
    });


    test('should fail with item having malformed linkTag', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: false, toId: 'toId' }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: '', toId: 'toId' }]);
      const run3 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', toId: 'toId' }]);
      const run4 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: 'fromId', linkTag: '*', toId: 'toId' }]);

      expect(run1).toThrowError('data.0.linkTag should be string');
      expect(run2).toThrowError('data.0.linkTag should NOT have fewer than 1 characters');
      expect(run3).toThrowError('data.0.linkTag should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.linkTag should match pattern "^[a-zA-Z0-9_]+$"');
    });


    test('should fail with item having malformed toId', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: false }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'i' }]);
      const run3 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }]);
      const run4 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: 'fromId', linkTag: 'tag', toId: '*a' }]);

      expect(run1).toThrowError('data.0.toId should be string');
      expect(run2).toThrowError('data.0.toId should NOT have fewer than 2 characters');
      expect(run3).toThrowError('data.0.toId should NOT have more than 128 characters');
      expect(run4).toThrowError('data.1.toId should match pattern "^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$"');
    });


    test('should succeed', () => {
      const run1 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }]);
      const run2 = () => validateCreateOrDeleteLinks([{ fromId: 'fromId', linkTag: 'tag', toId: 'toId' }, { fromId: 'fromId', linkTag: 'tag', toId: 'toId' }]);
      const run3 = () => validateCreateOrDeleteLinks([
        {
          fromId: 'fromId',
          linkTag: 'tag',
          toId: 'toId',
        },
        {
          fromId: 'fromId',
          linkTag: 'tag',
          toId: 'toId',
          unknown: true,
        },
      ]);

      expect(run1).not.toThrow();
      expect(run2).not.toThrow();
      expect(run3).not.toThrow();
    });
  });


  // --------------------------


  describe('validateQuery()', () => {
    test('should fail with not a string', () => {
      const run1 = () => validateQuery(undefined);
      const run2 = () => validateQuery(false);
      const run3 = () => (validateQuery as any)();

      expect(run1).toThrowError('data should be string');
      expect(run2).toThrowError('data should be string');
      expect(run3).toThrowError('data should be string');
    });


    test('should fail with incorrect min length', () => {
      const run1 = () => validateQuery('');
      const run2 = () => validateQuery('aaa');

      expect(run1).toThrowError('data should NOT have fewer than 4 characters');
      expect(run2).toThrowError('data should NOT have fewer than 4 characters');
    });


    test('should succeed', () => {
      const run1 = () => validateQuery('aaaa');
      const run2 = () => validateQuery('**********');

      expect(run1).not.toThrow();
      expect(run2).not.toThrow();
    });
  });
});
