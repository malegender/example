import { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { autobind } from 'core-decorators';
import { push } from 'connected-react-router';
import Type from 'prop-types';

import cn from 'arui-feather/cn';
import Heading from 'arui-feather/heading';
import Spin from 'arui-feather/spin';
import PromptConfirmationModal from 'arui-feather/prompt-confirmation-modal';
import { Row, Col } from '@/components/grid';

import HeadingDocs from '@/components/docs/heading';
import ButtonsBlock from '@/components/buttons-block';
import FilesUpload from '@/components/file/files-upload';

import { sendDocs } from '@/actions/docs';
import { DOCTYPE_PASSPORT } from '@/constants/docs';
import { EVENT } from '@/constants/events';
import * as REPORTS from '@/constants/reports';
import { RECEIPT } from '@/constants/routes';

@connect(mapStateToProps, mapDispatchToProps())
@cn('page-docs')
export default class extends Component {
    static propTypes = {
        pendingDocs: Type.bool,
        navigation: Type.func,
        sendDocs: Type.func
    }
    state = {
        passport: [],
        confirmation: false
    }

    render(cn) {
        const buttonNextDisable = this.buttonNextDisable();
        const buttonNextContent = this.renderButtonNextContent(cn);
        return (
            <div className={ cn() }>
                <HeadingDocs />
                <Heading size='s' className='heading_border'>
                    Сканирование документов
                </Heading>
                <Row>
                    <Col sm='6'>
                        <p className={ cn('title') }>
                            Прикрепите сканы паспорта
                        </p>
                    </Col>
                    <Col sm='6'>
                        <FilesUpload
                            onChangeFiles={ this.handleChangeFiles }
                        />
                    </Col>
                </Row>
                <ButtonsBlock
                    background={ true }
                    padding={ true }
                    confirmation={ false }
                    cancelButton={ false }
                    nextDisabled={ buttonNextDisable }
                    nextText={ buttonNextContent }
                    moreButtons={ [
                        {
                            children: 'Пропустить',
                            size: 'l',
                            onClick: this.handleClickSkipButton
                        }
                    ] }
                    onClickNextButton={ this.handleClickNextButton }
                />
                <PromptConfirmationModal
                    visible={ this.state.confirmation }
                    isProcessing={ false }
                    text='Не забудьте отправить документы. Продолжить?'
                    onCancelClick={ this.handleClickCancelConfirm }
                    onConfirmClick={ this.handleClickOkConfirm }
                />
            </div>
        );
    }

    renderButtonNextContent(cn) {
        return (
            <Fragment>
                <Spin
                    className={ cn('next-spin') }
                    size='m'
                    visible={ this.props.pendingDocs }
                    theme='alfa-on-color'
                />
                Продолжить
            </Fragment>
        );
    }

    @autobind
    handleChangeFiles(passport) {
        this.setState({ passport });
    }

    @autobind
    handleClickNextButton() {
        this.props.sendDocs({
            doctype: DOCTYPE_PASSPORT,
            files: this.state.passport,
            event: EVENT
        });
    }

    @autobind
    handleClickSkipButton() {
        this.setState({ confirmation: true });
    }

    @autobind
    handleClickOkConfirm() {
        this.props.navigation(RECEIPT);
    }

    @autobind
    handleClickCancelConfirm() {
        this.setState({ confirmation: false });
    }

    buttonNextDisable() {
        return this.state.passport.length === 0 || this.props.pendingDocs;
    }
}

function mapStateToProps({ files: { pending: pendingDocs } }) {
    return { pendingDocs };
}

function mapDispatchToProps() {
    return {
        sendDocs,
        navigation: push
    };
}
