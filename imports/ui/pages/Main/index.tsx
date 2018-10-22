import * as React from "react";
import Layout from "../../components/Layout";
import Schedule from "../../components/Schedule";

class Main extends React.Component {
  render() {
    return (
      <Layout>
        <Schedule />
      </Layout>
    );
  }
}

export default Main;
