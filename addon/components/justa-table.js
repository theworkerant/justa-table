import Ember from 'ember';
import layout from '../templates/components/justa-table';

const {
  Component,
  run,
  isEmpty,
  RSVP,
  computed: { empty }
} = Ember;

export default Component.extend({
  layout,
  classNames: ['justa-table'],
  classNameBindings: ['isLoading:loading:loaded', 'fixedHeight:justa-fixed-height'],

  init() {
    this._super(...arguments);
    let onLoadMoreRowsAction = this.getAttr('on-load-more-rows');
    if (!onLoadMoreRowsAction) {
      this.attrs['on-load-more-rows'] = RSVP.resolve();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._uninstallStickyHeaders();
    Ember.run.scheduleOnce('afterRender', this, this._installStickyHeaders);
  },

  willDestroyElement() {
    this._uninstallStickyHeaders();
  },

  _installStickyHeaders() {
    if (this.get('stickyHeader')) {
      this.$('table').stickyTableHeaders();
    }
  },

  _uninstallStickyHeaders() {
    if (this.get('stickyHeader')) {
      this.$('table').stickyTableHeaders('destroy');
    }
  },

  /**
    Sticky headers keep table header in a fixed position
    @public
  */
  stickyHeader: false,

  /**
    If the table should use pagination. Will fire the 'on-load-more-rows'
    action when it enters the viewport.
    @public
  */
  paginate: false,

  /**
    If the table should have a fixed height. Setting to an integer will set the height of the table to that.
    @public
  */
  fixedHeight: false,

  /**
    Css classes to apply to table rows.
    @public
  */
  rowClasses: null,

  /**
    If content is empty.
    @public
  */
  noContent: empty('content'),

  /**
    Name of data property for row groups in the table columns
    @public
  */
  rowGroupDataName: 'data',

  /**
    Ensure header heights are equal. Schedules after render to ensure it's
    called once per table.
    @public
  */
  ensureEqualHeaderHeight() {
    run.scheduleOnce('afterRender', this, this._ensureEqualHeaderHeight);
  },

  /**
    If we have any fixed columns, make sure the fixed columns and standard
    table column header heights stay in sync.
    @private
  */
  _ensureEqualHeaderHeight() {
    let fixedHeader = this.$('.fixed-table-columns th:first-of-type');
    if (isEmpty(fixedHeader)) {
      return;
    }
    let columnHeader = this.$('.table-columns th:first-of-type');
    let maxHeight = Math.max(fixedHeader.height(), columnHeader.height());

    fixedHeader.height(maxHeight);
    columnHeader.height(maxHeight);
  }
});
