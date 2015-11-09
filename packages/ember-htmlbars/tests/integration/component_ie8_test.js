import ComponentLookup from "ember-views/component_lookup";
import Component from "ember-views/views/component";
import EmberView from "ember-views/views/view";
import Registry from "container/registry";
import compile from "ember-template-compiler/system/compile";
import { runAppend, runDestroy } from "ember-runtime/tests/utils";

var view, registry, container;

QUnit.module("ember-htmlbars: component - dynamic type in IE8 safe environment", {
  setup() {
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.register('component-lookup:main', ComponentLookup);
  },

  teardown() {
    runDestroy(container);
    runDestroy(view);
    registry = container = view = null;
  }
});

QUnit.test("set type attribute in IE8 from template", function() {
  registry.register('component:x-foo', Component.extend({
    tagName: 'input',
    type: 'text',
    attributeBindings: ['type']
  }));

  view = EmberView.create({
    container: container,
    template: compile('{{x-foo type="email" ie8SafeInput=true}}')
  });

  runAppend(view);

  var type = view.$('input').attr('type');
  equal(type, 'email', 'Type was set to expected "email".');
});

QUnit.test("set type attribute in IE8 from component definition", function() {
  registry.register('component:x-foo', Component.extend({
    tagName: 'input',
    type: 'radio',
    attributeBindings: ['type']
  }));

  view = EmberView.create({
    container: container,
    template: compile('{{x-foo ie8SafeInput=true}}')
  });

  runAppend(view);

  var type = view.$('input').attr('type');
  equal(type, 'radio', 'Type was set to expected "radio".');
});
