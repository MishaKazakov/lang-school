import * as React from 'react';
import * as ReactModal from 'react-modal';

const cx = require("classnames/bind").bind(require("./style.scss"));

interface IProps {
	onClose: () => void;
	isOpen: boolean;
	modalClassName?: string;
	modalContentClassName?: string;
	title?: string;
}

interface IState {
	isOpen: boolean;
}

class Modal extends React.Component<IProps, IState>{
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		};
	}

	componentWillReceiveProps(nextProps) {
		nextProps.isOpen && !this.props.isOpen && this.open();
		!nextProps.isOpen && this.props.isOpen && this.close();
	}

	open = () => {
		this.setState({ isOpen: true });
	}

	close = () => {
		this.setState({ isOpen: false });
		this.props.onClose && this.props.onClose();
	}

	render() {
		const { children, onClose, title, modalContentClassName, modalClassName } = this.props;
		const { isOpen } = this.state;

		return (
			isOpen && (
				<ReactModal
					isOpen={isOpen}
					onRequestClose={this.close}
					shouldCloseOnEsc={true}
					ariaHideApp={false}
					overlayClassName={cx('modal__overlay')}
					className={cx("modal__content", modalClassName)}
				>
					<span className={cx('modal__close')} onClick={this.close} />
					{title && (
						<div className={cx('modal__title')}>
							{title}
						</div>
					)}
					<div className={modalContentClassName}>
						{children}
					</div>
				</ReactModal>
			)
		);
	}
}

export default Modal;
