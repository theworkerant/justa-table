import Ember from 'ember';
import layout from '../templates/components/table-column';
import InViewportMixin from 'ember-in-viewport';

const {
  Component,
  computed,
  get,
  isEmpty,
  run,
  assert
} = Ember;

export default Component.extend(InViewportMixin, {
  layout,
  tagName: 'td',
  attributeBindings: ['cellTitle:title'],
  classNameBindings: ['alignCenter:center', 'alignRight:right', 'shouldUseFakeRowspan:fake-rowspan', 'viewportEntered:in-viewport'],
  alignCenter: computed.equal('align', 'center'),
  alignRight: computed.equal('align', 'right'),
  /**
    The header component this column should use to render its header.
    @public
    @default 'basic-header'
  */
  headerComponent: 'basic-header',

  /**
    Rows whose value matches the prior row will be returned as null
    resulting in them appearing grouped
    @public
  */
  groupWithPriorRow: false,

  /**
    The width of this column in pixels.
    @public
  */
  width: 0,

  /**
    The minimum width this column can be. Only used when resize is true.
    @public
  */
  minWidth: 0,

  /**
    If the table column is resizable.
    @public
    @default false
  */
  resizable: false,

  /**
    If a fake rowspan class should be added when the cell value is empty.
    @public
    @default false
  */
  useFakeRowspan: false,

  shouldUseFakeRowspan: computed('useFakeRowspan', '_value', function() {
    let value = this.get('_value');
    let useFakeRowspan = this.get('useFakeRowspan');
    return useFakeRowspan && isEmpty(value);
  }),

  /**
    Return the title attribute for the tag with the cell value
    @public
  */
  cellTitle: computed('title', '_value', function() {
    let value = this.get('_value');

    return this.getWithDefault('title', value);
  }),

  /**
    The registered parent wrapper of this column (TableColumns or FixedTableColumns).
    @private
  */
  _registeredParent: null,

  init() {
    this._super(...arguments);
    assert('Must use table column as a child of table-columns or fixed-table-columns.', this.parentView);
    run.scheduleOnce('actions', this, this._registerWithParent);

    this._setValueDependentKeys();
  },

  /**
    Sets dependent keys on the _value computed property. This is done since
    we need to clear the cached version based on a dynamic key, and volatile()
    does not do the needful.
    @private
  **/
  _setValueDependentKeys() {
    const path = this.get('valueBindingPath');
    const pathKey = `row.${path}`;
    this._value.property('valueBindingPath', 'row', pathKey);
  },

  /**
    Return the value for the cell based on row.valueBindingPath. Only used if
    a block is not passed, the path is provided, and the row is not empty.
    If this column groups values together, the value will be returned as null
    if it matches the prior row.
    @private
  */
  _value: computed('valueBindingPath', 'row', function() {
    const path = this.get('valueBindingPath');
    const row = this.get('row');
    const hasBlockParams = this.get('hasBlockParams');

    if (hasBlockParams || isEmpty(path) || isEmpty(row)) {
      return null;
    }

    let currentValue = get(row, path);
    let groupWithPriorRow = this.get('groupWithPriorRow');

    if (groupWithPriorRow) {
      let parentView = this.get('parentView');
      let lastValue = parentView.get(`values.${path}`);

      if (currentValue === lastValue) {
        return null;
      } else {
        parentView.set(`values.${path}`, currentValue);
        return currentValue;
      }
    } else {
      return currentValue;
    }
  }),

  /**
    Register this column with its parent view.
    @private
  */
  _registerWithParent() {
    let parent = this.get('parentView');
    parent.registerColumn(this);
    this.set('_registeredParent', parent);
  },

  willDestroyElement() {
    let parent = this.get('_registeredParent');
    if (parent) {
      parent.unregisterColumn(this);
    }
  }
});
