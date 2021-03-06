import React from 'react';
import { connect } from 'react-redux';
import { Spin, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { createActions } from 'modules/create';
import { AppState } from 'store/reducers';
import { getProposalByAddress } from 'modules/proposals/selectors';
import { ProposalWithCrowdFund } from 'types';
import './Final.less';

interface StateProps {
  form: AppState['create']['form'];
  crowdFundError: AppState['web3']['crowdFundError'];
  crowdFundCreatedAddress: AppState['web3']['crowdFundCreatedAddress'];
  createdProposal: ProposalWithCrowdFund | null;
}

interface DispatchProps {
  createProposal: typeof createActions['createProposal'];
}

type Props = StateProps & DispatchProps;

class CreateFinal extends React.Component<Props> {
  componentDidMount() {
    this.create();
  }

  render() {
    const { crowdFundError, crowdFundCreatedAddress, createdProposal } = this.props;
    let content;
    if (crowdFundError) {
      content = (
        <div className="CreateFinal-message is-error">
          <Icon type="close-circle" />
          <div className="CreateFinal-message-text">
            Something went wrong during creation: "{crowdFundError}"{' '}
            <a onClick={this.create}>Click here</a> to try again.
          </div>
        </div>
      );
    } else if (crowdFundCreatedAddress && createdProposal) {
      content = (
        <div className="CreateFinal-message is-success">
          <Icon type="check-circle" />
          <div className="CreateFinal-message-text">
            Your proposal is now live and on the blockchain!{' '}
            <Link to={`/proposals/${createdProposal.proposalUrlId}`}>Click here</Link> to
            check it out.
          </div>
        </div>
      );
    } else {
      content = (
        <div className="CreateFinal-loader">
          <Spin size="large" />
          <div className="CreateFinal-loader-text">Deploying contract...</div>
        </div>
      );
    }

    return <div className="CreateFinal">{content}</div>;
  }

  private create = () => {
    if (this.props.form) {
      this.props.createProposal(this.props.form);
    }
  };
}

export default connect<StateProps, DispatchProps, {}, AppState>(
  (state: AppState) => ({
    form: state.create.form,
    crowdFundError: state.web3.crowdFundError,
    crowdFundCreatedAddress: state.web3.crowdFundCreatedAddress,
    createdProposal: getProposalByAddress(
      state,
      state.web3.crowdFundCreatedAddress || '',
    ),
  }),
  {
    createProposal: createActions.createProposal,
  },
)(CreateFinal);
