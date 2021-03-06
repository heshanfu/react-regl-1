// @flow
import * as React from 'react';

import typeof { Texture as TextureType } from '../types';
import { CONSTANTS } from '../Regl.types';

type Props = {
  children?: texture => React.ReactNode,
  innerRef: React.RefObject<any>,
};

type State = {
  ref: TextureType
}

class Texture extends React.Component<Props, State> {
  static defaultProps = {
    children: () => null,
  };

  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef();
  }

  state = {
    ref: null,
  }

  componentDidMount() {
    const ref = this.ref.current;
    if (ref) {
      this.setState({ ref });
    }
  }

  componentDidUpdate() {
    if (this.ref.current) {
      this.ref.current.update();
    }
  }

  render() {
    const { children, innerRef, ...props } = this.props;
    const { ref: texture } = this.state;
    return (
      <CONSTANTS.Texture ref={this.ref} {...props}>
        {texture ? children(texture.getInstance()) : null}
      </CONSTANTS.Texture>
    );
  }
}

export default React.forwardRef((props, ref) => <Texture {...props} innerRef={ref} />);
