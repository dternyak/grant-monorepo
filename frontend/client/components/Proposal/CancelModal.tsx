import React from 'react';
import { connect } from 'react-redux';
import { Modal, Alert } from 'antd';
import { ProposalWithCrowdFund } from 'types';
import { web3Actions } from 'modules/web3';
import { AppState } from 'store/reducers';

interface OwnProps {
  proposal: ProposalWithCrowdFund;
  isVisible: boolean;
  handleClose(): void;
}

interface StateProps {
  isRefundActionPending: AppState['web3']['isRefundActionPending'];
  refundActionError: AppState['web3']['refundActionError'];
}

interface DispatchProps {
  triggerRefund: typeof web3Actions['triggerRefund'];
}

type Props = StateProps & DispatchProps & OwnProps;

class CancelModal extends React.Component<Props> {
  componentDidUpdate() {
    if (this.props.proposal.crowdFund.isFrozen) {
      this.props.handleClose();
    }
  }

  render() {
    const { proposal, isVisible, isRefundActionPending, refundActionError } = this.props;
    const hasBeenFunded = proposal.crowdFund.isRaiseGoalReached;
    const hasContributors = !!proposal.crowdFund.contributors.length;
    const disabled = isRefundActionPending;

    return (
      <Modal
        title={<>Cancel proposal</>}
        visible={isVisible}
        okText="Confirm"
        cancelText="Never mind"
        onOk={this.cancelProposal}
        onCancel={this.closeModal}
        okButtonProps={{ type: 'danger', loading: disabled }}
        cancelButtonProps={{ disabled }}
      >
        {hasBeenFunded ? (
          <p>
            Are you sure you would like to issue a refund?{' '}
            <strong>This cannot be undone</strong>. Once you issue a refund, all
            contributors will be able to receive a refund of the remaining proposal
            balance.
          </p>
        ) : (
          <p>
            Are you sure you would like to cancel this proposal?{' '}
            <strong>This cannot be undone</strong>. Once you cancel it, all contributors
            will be able to receive refunds.
          </p>
        )}
        <p>
          Canceled proposals cannot be deleted and will still be viewable by contributors
          or anyone with a direct link. However, they will be de-listed everywhere else on
          Grant.io.
        </p>
        {hasContributors && (
          <p>
            Should you choose to cancel, we highly recommend posting an update to let your
            contributors know why you’ve decided to do so.
          </p>
        )}
        {refundActionError && (
          <Alert
            type="error"
            message={`Failed to ${hasBeenFunded ? 'refund' : 'cancel'} proposal`}
            description={refundActionError}
            showIcon
          />
        )}
      </Modal>
    );
  }

  private closeModal = () => {
    if (!this.props.isRefundActionPending) {
      this.props.handleClose();
    }
  };

  private cancelProposal = () => {
    this.props.triggerRefund(this.props.proposal);
  };
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  state => ({
    isRefundActionPending: state.web3.isRefundActionPending,
    refundActionError: state.web3.refundActionError,
  }),
  {
    triggerRefund: web3Actions.triggerRefund,
  },
)(CancelModal);
