import EmberComponent from 'ember-views/views/component';
import EmberView from 'ember-views/views/view';
import EmberSelectView from 'ember-views/views/select';
import { runAppend, runDestroy } from 'ember-runtime/tests/utils';
import compile from 'ember-template-compiler/system/compile';
import Registry from 'container/registry';

import { registerAstPlugin, removeAstPlugin } from 'ember-htmlbars/tests/utils';
import DeprecateViewHelper from 'ember-template-compiler/plugins/deprecate-view-helper';

import { registerKeyword, resetKeyword } from 'ember-htmlbars/tests/utils';
import viewKeyword from 'ember-htmlbars/keywords/view';

let component, registry, container, originalViewKeyword;

QUnit.module('ember-htmlbars: compat - view helper', {
  setup() {
    registerAstPlugin(DeprecateViewHelper);

    originalViewKeyword = registerKeyword('view',  viewKeyword);

    registry = new Registry();
    container = registry.container();
  },
  teardown() {
    runDestroy(component);
    runDestroy(container);
    removeAstPlugin(DeprecateViewHelper);
    registry = container = component = null;

    resetKeyword('view', originalViewKeyword);
  }
});

QUnit.test('using the view helper with a string (inline form) is deprecated [DEPRECATED]', function(assert) {
  const ViewClass = EmberView.extend({
    template: compile('fooView')
  });
  registry.register('view:foo', ViewClass);

  expectDeprecation(function() {
    component = EmberComponent.extend({
      layout: compile('{{view \'foo\'}}'),
      container
    }).create();

    runAppend(component);
  }, /Using the `{{view "string"}}` helper is deprecated/);

  assert.equal(component.$().text(), 'fooView', 'view helper is still rendered');
});

QUnit.test('using the view helper with a string (block form) is deprecated [DEPRECATED]', function(assert) {
  const ViewClass = EmberView.extend({
    template: compile('Foo says: {{yield}}')
  });
  registry.register('view:foo', ViewClass);

  expectDeprecation(function() {
    component = EmberComponent.extend({
      layout: compile('{{#view \'foo\'}}I am foo{{/view}}'),
      container
    }).create();

    runAppend(component);
  }, /Using the `{{view "string"}}` helper is deprecated/);

  assert.equal(component.$().text(), 'Foo says: I am foo', 'view helper is still rendered');
});

QUnit.test('using the view helper with string "select" has its own deprecation message [DEPRECATED]', function(assert) {
  registry.register('view:select', EmberSelectView);

  expectDeprecation(function() {
    component = EmberComponent.extend({
      layout: compile('{{view \'select\'}}'),
      container
    }).create();

    runAppend(component);
  }, /Using `{{view "select"}}` is deprecated/);

  assert.ok(!!component.$('select').length, 'still renders select');
});

