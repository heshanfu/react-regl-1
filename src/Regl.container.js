// @flow
import * as React from 'react';
import * as ReactIs from 'react-is';
import _ from 'lodash';

import ReglRenderer from './Regl.renderer';
import ReglProvider from './Regl.provider'; // eslint-disable-line no-unused-vars
import typeof { Context } from './types';

type Callback = (context: Context) => any;

type Props = {
  onMount?: Callback,
  onRender?: Callback,
  renderer: typeof ReglRenderer,
  context: Context,
  initGLContext: (canvasRef: mixed) => Context,
  viewProps: {
    ref: React.Ref<any>
  },
  View?: React.ElementType,
  children?: React.Node
};

// $FlowFixMe
@ReglProvider
export default class ReglContainer extends React.Component<Props> {
  static defaultProps = {
    onMount: () => {},
    onRender: () => {},
    View: null,
    children: null,
  };

  constructor(props: Props) {
    super(props);
    const { viewProps, onRender } = props;
    this.onRender = _.once(context => {
      if (onRender) onRender(context);
    });
    this.viewRef = viewProps.ref || React.createRef();
  }

  componentDidMount() {
    const { renderer, context: ctx, initGLContext, onMount } = this.props;
    const context = this.viewRef.current ? initGLContext(this.viewRef.current) : ctx;
    this.mountNode = renderer.reconciler.createContainer(context);
    if (onMount) onMount(context);
  }

  componentDidUpdate() {
    const { renderer, context, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this, () => {
      this.onRender(context);
    });
    if (context) context.update();
  }

  componentWillUnmount() {
    const { renderer, context } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
    context.destroy();
  }

  onRender: Callback;

  mountNode: any;

  viewRef: React.Ref<any>;

  render() {
    const { viewProps, View } = this.props;
    if (View && ReactIs.isValidElementType(View)) {
      return <View {...viewProps} ref={this.viewRef} />;
    }
    return null;
  }
}
