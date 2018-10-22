import * as React from 'react';

// Task component - represents a single todo item

class Task extends React.Component {
  render() {
    return <li>{this.props.task.text}</li>;
  }
}

export default Task;